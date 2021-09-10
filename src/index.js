import app from './app'
import './database.js'
import config from './config'
import jwt from 'jsonwebtoken'
import Usuario from './Models/Usuario'
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
            socket.userId = payload.id;
            const userData = await Usuario.findById(payload.id);
            socket.userData = userData;
            next();
        } catch (error) {
            const err = new Error("No autorizado!");
            err.data = { type: 'forbidden' };
            next(err);
        }
    })

    io.on('connection', (socket) => {
        console.info("Conexion establecida: " + socket.userId);
        socket.join(socket.userData.companyId)
        socket.on("disconnect", () => {
            console.info("Conexion perdida: " + socket.userId);
        })
    })

// }




export function socketSend(roomId, key, message) {
    console.info("enviando '" + key + "' a la sala '" + roomId + "' con el contenido '" + message + "'");
    io.to(roomId).emit(key, message);
}

export function alertSend(roomId, nivel, tipo, message, vehiculo){
    console.info(`emitiendo 'alerta' nivel ${nivel} de tipo ${tipo} a la sala ${roomId} con el mensaje ${message}`)
    io.to(roomId).emit("alerta",{
        nivel, 
        tipo,
        message,
        vehiculo
    });
}

export function dataUpdate(roomId, vehiculo, datos){
    console.info(`emitiendo actualizacion de informacion del vehiculo '${vehiculo}' de la compania '${roomId}'`);
    io.to(roomId).emit("datos",{
        vehiculo,
        datos
    });
}

export function companyUpdate(roomId){
    console.info(`actualizando la info de la compania ${roomId}`);
    io.to(roomId).emit("datosnuevos")
}