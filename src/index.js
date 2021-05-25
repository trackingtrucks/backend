import app from './app'
const PORT = app.get('port');
import './database.js'
import config from './config'
import jwt from 'jsonwebtoken'

const server = app.listen(app.get('port'), () => console.log(`Server corriendo en el puerto ${PORT}`));
const io = require('socket.io')(server);

//SOCKET
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, config.SECRET);
        socket.userId = payload.id;
        next();
    } catch (error) {
        const err = new Error("No autorizado!");
        err.data = { type: 'forbidden' };
        next(err);
    }
})

io.on('connection', (socket) => {
    console.log("Conexion establecida: " + socket.userId);
    socket.on("disconnect", () => {
        console.log("Conexion perdida: " + socket.userId);
    })
})
