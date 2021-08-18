import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.get('/', [auth.verifyTokenWithVehicleData, auth.onlyConductor], Users.getUserData)    
rutas.post('/codigo/conductor', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.onlyGestor], Users.codigoConductor) //Crea un codigo de registro para conductor dentro de la compania
rutas.post('/codigo/gestor', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.onlyGestor], Users.codigoGestor) //Crea un codigo de registro para gestor dentro de la compania

rutas.post("/crearTurno", [auth.verifyToken, auth.onlyGestor, verify.turnoYaCreado, verify.fechaValida], Users.crearTurno) //Crea un turno

rutas.post("/restablecer", [verify.emailIsValid], Users.restablecerContaseña); //Pedir un email de restablecimiento

rutas.patch("/cambiar/contrasena/token", Users.cambiarContraseñaPorToken); //Cambia la contraseña con un token de uso unico enviado por email
rutas.patch("/cambiar/contrasena/logueado", [auth.verifyTokenWithPassword], Users.cambiarContraseñaLogueado); //Cambia la contraseña estando logueado y pidiendo la contraseña vieja
rutas.patch("/cambiar/perfil", [auth.verifyToken, verify.emailIsValid, verify.existeUsuarioOEmail], Users.editarUsuario); //Cambiar la info de usuario

rutas.put('/asignarTurno', [auth.verifyToken, auth.onlyGestor, verify.conductorNoEncontrado, verify.turnoNoCreado], Users.asignarTurno);//Asignar un usuario a un turno

export default rutas