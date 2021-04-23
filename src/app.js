// DEPENDENCIAS
import express from 'express';
import morgan from 'morgan'
import pkg from '../package.json'

// MOCK IMPORTS
import testRutas from './Mock/Mock.routes'

// RUTAS
// import productosRutas from './Routes/products.routes'
import userRutas from './Routes/user.routes'
import authRutas from './Routes/auth.routes'
import infoRutas from './Routes/info.routes'
import debugRutas from './debug/debug.routes'

// CONFIG
import config from './config'
import {crearRoles} from './Libs/initSetup'
crearRoles()
const app = express();
import cors from 'cors'

app.set('pkg', pkg)
app.set("port", config.PORT);
app.use(express.json())
app.use(morgan('dev'));
app.use(cors());

// RUTA DEFAULT
app.get('/', (req, res) => {
    res.json({
        message: "Oh, encontraste la api! Bueno, bienvenido, no toques nada porfi :)",
        rutas: {
            "/mock/auth": [
                "/login",
                "/login.contrainvalida",
                "/login.usuarioinvalido",
                "/register",
                "/register.emailyausado"
            ],
            "/info": [
                "/",
                "/package.json",
                "/:especifico"
            ],
            "/generar_error":[
                "/:codigo"
            ]
        } 
    })
})

app.use("/info", infoRutas)

// APLICANDO RUTAS
// app.use('/productos', productosRutas)
app.use('/auth', authRutas)
app.use('/user', userRutas)
app.use("/mock", testRutas)
app.use("/debug", debugRutas)

app.all('*', function (req, res) {
    res.status(404).json({
        message: 'No se pudo obtener la ruta ' + req.url,
        status: 404
    });
});
export default app;