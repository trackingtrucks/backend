import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/login',[ verify.emailIsValid], Auth.login); //Ruta para validar la identidad del usuario
rutas.post('/register', [verify.emailIsValid, auth.verifyCodigoRegistro, verify.existeUsuarioOEmail], Auth.registrar); //Ruta para crearse una cuenta

rutas.get('/token', Auth.newAccessToken); //Pide un access token nuevo
// rutas.get('/refreshtoken',  Auth.newRefreshToken);
rutas.delete('/token', [auth.verifyToken], Auth.logout) //Cierra sesión en un dispositivo en especifico
rutas.delete('/tokens', [auth.verifyTokenWithPassword], Auth.logoutAllDevices) //Cierra sesion en todos los dispositivos


export default rutas