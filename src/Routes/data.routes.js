import { Router } from "express";
import { auth } from '../Middlewares/index';
import * as Data from '../Controllers/data.controller'
const rutas = Router();
// import * as Data from '../Controllers/data.controller.js'

rutas.post('/', [auth.verifyToken, auth.onlyConductor], Data.subirDatosOBD)

export default rutas