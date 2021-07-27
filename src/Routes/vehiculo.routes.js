import { Router } from "express";
const rutas = Router();
import * as Vehiculo from '../Controllers/vehiculo.controller.js'
import * as Company from '../Controllers/company.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/', [auth.verifyToken, verify.existePatenteRegistrada, auth.isGestor], Vehiculo.crear)
rutas.put('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioYaAsignado, verify.vehiculoYaAsignado], Vehiculo.asignarConductor)
rutas.delete('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioNoAsignado, verify.vehiculoNoAsignado], Vehiculo.desasignarConductor)

rutas.delete('/alertas', [auth.verifyToken, auth.onlyGestor], Vehiculo.eliminarAlertas)
rutas.delete('/alerta', [auth.verifyToken, auth.onlyGestor], Vehiculo.eliminarAlertaById)

rutas.post('/tareas', [auth.verifyToken, auth.onlyGestor], Company.crearTarea)
rutas.patch('/tarea', [auth.verifyToken, auth.onlyGestor], Company.editarTarea)
rutas.get('/tarea', [auth.verifyToken, auth.onlyGestor], Company.getTareaById)
rutas.get('/tareas', [auth.verifyToken, auth.onlyGestor], Company.getTareasByVehiculo)
export default rutas