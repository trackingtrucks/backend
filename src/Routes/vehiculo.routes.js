import { Router } from "express";
const rutas = Router();
import * as Vehiculo from '../Controllers/Vehiculo.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/',
    [auth.verifyToken, verify.existePatenteRegistrada, auth.isGestor],
    Vehiculo.crear)


export default rutas