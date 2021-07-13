import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify, limit } from '../Middlewares/index'

    
rutas.get('/codigo/conductor', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.onlyGestor], Users.codigoConductor)
rutas.get('/codigo/gestor', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.onlyGestor], Users.codigoGestor)

rutas.post("/crearTurno", [auth.verifyToken, auth.onlyGestor, verify.turnoYaCreado, verify.fechaValida], Users.crearTurno)

//rutas.put('/asignarTurno', [auth.verifyToken, auth.onlyGestor, verify.conductorNoEncontrado, verify.turnoNoCreado], Users.asignarTurno)

export default rutas