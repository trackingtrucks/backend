import app from './app'
import './database.js'
import config from './config'
import jwt from 'jsonwebtoken'
import Usuario from './Models/Usuario'
import cluster from 'cluster';
import os from 'os';
let io;
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.info("Cantidad de cores: " + numCPUs);
    console.log(`Server corriendo en el puerto ${app.get('port')}`)
    console.log(`Maestro ${process.pid} corriendo!`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.error(`Worker ${worker.process.pid} fucking died :(`);
        cluster.fork();
    });
} else {
    console.log(`Worker ${cluster.worker.process.pid} levantado`);
    const server = app.listen(app.get('port'));
    io = require('socket.io')(server);

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
        console.log("Conexion establecida: " + socket.userId);
        socket.join(socket.userData.companyId)
        socket.on("disconnect", () => {
            console.log("Conexion perdida: " + socket.userId);
        })
    })

}




export default function socketSend(roomId, key, message) {
    console.log("enviando '" + key + "' a la sala '" + roomId + "' con el contenido '" + message + "' " + "en el cluster " + cluster.worker.process.pid);
    io.to(roomId).emit(key, message);
}
