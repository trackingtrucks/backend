// DEPENDENCIAS
import express from 'express';
import morgan from 'morgan'
import pkg from '../package.json'

// MOCK IMPORTS
import testRutas from './Mock/Mock.routes'

// RUTAS
import productosRutas from './Routes/products.routes'
import userRutas from './Routes/user.routes'
import authRutas from './Routes/auth.routes'

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
    res.json("Oh, encontraste la api! Bueno, bienvenido, no toques nada porfi :) || SENT FROM NEW API")
})
app.get('/info', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        autor: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
})

// APLICANDO RUTAS
app.use('/productos', productosRutas)
app.use('/auth', authRutas)
app.use('/user', userRutas)
app.use("/mock", testRutas)

export default app;