import app from './app'
import './database.js'
import config from './config'
import jwt from 'jsonwebtoken'
import Usuario from './Models/Usuario'
import * as SocketCache from './Libs/socketCache'
import sha256 from 'js-sha256';
import Compania from './Models/Compania'
// import cluster from 'cluster';
// let io;

// if (cluster.isMaster) {
//     console.info("Cantidad de cores: " + require('os').cpus().length);
//     console.log(`Server corriendo en el puerto ${app.get('port')}`)
//     console.log(`Maestro ${process.pid} corriendo!`);
//     for (let i = 0; i < require('os').cpus().length; i++) {
//         cluster.fork();
//     }
//     cluster.on('exit', (worker) => {
//         console.error(`Worker ${worker.process.pid} fucking died :(`);
//         cluster.fork();
//     });
// } else {
//     console.log(`Worker ${cluster.worker.process.pid} levantado`);

// const server = app.listen(app.get('port'));
const server = app.listen(app.get('port'), () => console.info(`Servidor iniciado en el puerto ${app.get('port')}`));
const io = require('socket.io')(server);

//SOCKET
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, config.SECRET);
        socket.payload = payload;
        socket.userId = payload.id;
        const userData = await Usuario.findById(payload.id).select("+refreshTokens");
        userData.refreshTokens.forEach((token, i) => {
            userData.refreshTokens[i] = sha256(token + config.SALT)
        })
        if (!userData.refreshTokens.includes(payload.gen)) throw new Error("revoked")
        socket.userData = userData;
        next();
    } catch (error) {
        const err = new Error("No autorizado!");
        err.data = { type: 'forbidden' };
        next(err);
    }
})

io.on('connection', (socket) => {
    console.info("Conexion establecida con el usuario: " + socket.userId + " - " + socket.id);
    SocketCache.add({ id: socket.userId, company: socket.userData.companyId, ucid: socket.id, gen: socket.payload.gen, socket: socket.disconnect })
    socket.join(socket.userData.companyId)
    socket.on("disconnect", () => {
        console.info("Conexion perdida con el usuario: " + socket.userId + " - " + socket.id);
        SocketCache.remove(socket.id)
    })
})

// }

export async function socketSend(roomId, key, message, tipo) {
    const compania = await Compania.findOne({ companyId: roomId })
    if (compania.alertas[tipo] === true) {
        console.info("enviando '" + key + "' a la sala '" + roomId + "' con el contenido '" + message + "'");
        io.to(roomId).emit(key, message);
    } else {
        console.log("notificacion desactivada");
        return;
    }


}

export function alertSend(roomId, nivel, tipo, message, vehiculo) {
    io.to(roomId).emit("alerta", {
        nivel,
        tipo,
        message,
        vehiculo
    });
}

export function dataUpdate(roomId, vehiculo, datos) {
    console.info(`emitiendo actualizacion de informacion del vehiculo '${vehiculo}' de la compania '${roomId}'`);
    io.to(roomId).emit("datos", {
        vehiculo,
        datos
    });
}

export function companyUpdate(roomId) {
    console.info(`actualizando la info de la compania ${roomId}`);
    io.to(roomId).emit("datosnuevos")
}

export function disconnectById(givenSocketID) {
    console.log("desconectando " + givenSocketID);
    io.sockets.sockets.forEach((socket) => {
        if (socket.id === givenSocketID) {
            socket.emit('logout');
            socket.disconnect(true);
        }
    });
}