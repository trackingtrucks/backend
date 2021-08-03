import { Router } from "express";
const rutas = Router();
import * as Vehiculo from '../Controllers/vehiculo.controller.js'
import * as Company from '../Controllers/company.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/', [auth.verifyToken, verify.existePatenteRegistrada, auth.onlyGestor], Vehiculo.crear) //Crear un vehiculo
rutas.put('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioYaAsignado, verify.vehiculoYaAsignado], Vehiculo.asignarConductor) //Asignarse a un vehiculo
rutas.delete('/', [auth.verifyToken, auth.onlyConductor, verify.usuarioNoAsignado, verify.vehiculoNoAsignado], Vehiculo.desasignarConductor) //Desasignarse a un vehiculo

rutas.delete('/alertas', [auth.verifyToken, auth.onlyGestor], Vehiculo.eliminarAlertas) //Eliminar todas las alertas de un vehiculo
rutas.delete('/alerta', [auth.verifyToken, auth.onlyGestor], Vehiculo.eliminarAlertaById) //Elimina una alerta de un vehiculo en especifico

rutas.post('/tareas', [auth.verifyToken, auth.onlyGestor], Company.crearTarea) //Crea una tarea para un vehiculo
rutas.patch('/tarea', [auth.verifyToken, auth.onlyGestor], Company.editarTarea) //Edita una tarea para un vehiculo
rutas.get('/tarea', [auth.verifyToken, auth.onlyGestor], Company.getTareaById) //Agarra una tarea por su id
rutas.get('/tareas', [auth.verifyToken, auth.onlyGestor], Company.getTareasByVehiculo) //Agarra las tareas de un vehiculo en especifico
export default rutas