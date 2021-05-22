import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/login',
    [limit.l60s5r, verify.emailIsValid],
    Auth.login);

rutas.post('/register/gestor',
    [verify.emailIsValid, auth.verifyCodigoRegistro, verify.existeUsuarioOEmail],
    Auth.registrarGestor);

rutas.post('/register/conductor',
    [verify.emailIsValid, auth.verifyCodigoRegistro, verify.existeUsuarioOEmail],
    Auth.registrarConductor);

rutas.post('/register/admin',
    [verify.emailIsValid, limit.l60s5r, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
    Auth.registrarAdmin);

rutas.get('/token',
    [limit.l1h3r],
    Auth.newAccessToken);

rutas.delete('/token',
    [auth.verifyToken],
    Auth.logout)

rutas.delete('/tokens',
    [auth.verifyToken],
    Auth.logoutAllDevices)

rutas.post('/admin/register/gestor',
    [limit.l60s5r, verify.emailIsValid, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
    Auth.registrarGestor);

rutas.post('/admin/register/conductor',
    [verify.emailIsValid, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
    Auth.registrarConductor);

export default rutas