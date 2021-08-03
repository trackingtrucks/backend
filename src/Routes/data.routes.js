import { Router } from "express";
import { auth } from '../Middlewares/index';
import * as Data from '../Controllers/data.controller'
const rutas = Router();
// import * as Data from '../Controllers/data.controller.js'

rutas.post('/', [auth.verifyToken, auth.onlyConductor], Data.subirDatosOBD) //subir la informacion de los sensores al sistema
rutas.post('/2', Data.subirDatosOBD2) //ruta-de-prueba
rutas.get('/sample', Data.sample) //ruta-de-prueba

export default rutas