// DEPENDENCIAS
import express from 'express';
import morgan from 'morgan'
import pkg from '../package.json'
// RUTAS
// import productosRutas from './Routes/products.routes'
import userRutas from './Routes/user.routes'
import authRutas from './Routes/auth.routes'
import dataRutas from './Routes/data.routes'
import vehiculoRutas from './Routes/vehiculo.routes'
import companyRutas from './Routes/company.routes'
import adminRutas from './Routes/admin.routes'

// CONFIG
// import {logPID} from './Libs/logPID'
import config from './config'
import { initSetup } from './Libs/initSetup'
initSetup()
const app = express();
import cors from 'cors'

app.set('pkg', pkg)
app.set("port", config.PORT);
app.use(express.json())
app.use(cors());
switch (config.NODE_ENV) {
    case 'development':
        app.use(morgan('dev'));
        // app.use(require('./Libs/logSize').logSize);
        console.info("Iniciando servidor en modo 'development'");
        break;
    case 'production':
        app.use(morgan('combined', {
            skip: function (req, res) { return res.statusCode < 400 }
        }));
        console.info("Iniciando servidor en modo 'production'");
        break;

    default:
        console.info("Iniciando servidor en modo 'desconocido', no se como llegaste aca pero no está bien");
        throw new Error("No se especificó modo de funcionamiento");
}
// app.use(logPID)
// RUTA DEFAULT
app.get('/', (req, res) => {
    res.json({
        message: "Oh, encontraste la api! Bueno, bienvenido, no toques nada porfi :)"
    }).status(200)
})


// APLICANDO RUTAS  
// app.use('/productos', productosRutas)
app.use('/auth', authRutas)
app.use('/user', userRutas)
app.use("/vehiculo", vehiculoRutas)
app.use("/data", dataRutas)
app.use("/company", companyRutas)
app.use("/admin", adminRutas)

app.all('*', function (req, res) {
    res.status(404).send('No se pudo obtener la ruta ' + req.url);
});
export default app;