import { Router } from "express";
const rutas = Router();
import * as Vehiculo from '../Controllers/vehiculo.controller.js'
import * as Company from '../Controllers/company.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/', [auth.verifyToken, verify.existePatenteRegistrada, auth.isGestor], Vehiculo.crear)
rutas.put('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioYaAsignado, verify.vehiculoYaAsignado], Vehiculo.asignarConductor)
rutas.delete('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioNoAsignado, verify.vehiculoNoAsignado], Vehiculo.desasignarConductor)

rutas.post('/tareas', [auth.verifyToken, auth.onlyGestor], Company.crearTarea)

export default rutas