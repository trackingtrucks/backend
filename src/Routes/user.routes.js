import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.delete('/account',
    [auth.verifyToken, auth.isAdmin, limit.l5m5r],
    Users.eliminar)
    
rutas.get('/', [auth.verifyToken, auth.isAdmin], Users.getAll)

rutas.get('/debug', [auth.verifyToken], Users.returnData)

rutas.get('/codigo/gestor', [auth.verifyToken, auth.isAdmin], Users.codigoGestor)
rutas.get('/codigo/conductor', [auth.verifyToken, auth.isGestor], Users.codigoConductor)

rutas.get('/codigo/check', Users.codigoCheck)

rutas.post("/socketTest", [auth.verifyToken], Users.socketTest)

rutas.post("/crearTurno", [auth.verifyToken, auth.onlyGestor ,verify.turnoYaCreado, verify.fechaValida], Users.crearTurno)

export default rutas