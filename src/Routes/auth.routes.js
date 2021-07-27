import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/login',[ verify.emailIsValid], Auth.login);
rutas.post('/register', [verify.emailIsValid, auth.verifyCodigoRegistro, verify.existeUsuarioOEmail], Auth.registrar);

rutas.get('/token', Auth.newAccessToken);
rutas.delete('/token', [auth.verifyToken], Auth.logout)
rutas.delete('/tokens', [auth.verifyTokenWithPassword], Auth.logoutAllDevices)


export default rutas