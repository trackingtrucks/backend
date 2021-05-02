import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/login',
    [limit.l60s5r],
    Auth.login);

rutas.post('/register/gestor',
    [limit.l60s5r, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
    Auth.registrarGestor);

rutas.post('/register/conductor',
    [limit.l60s5r, auth.verifyToken, auth.isGestor, verify.existeUsuarioOEmail],
    Auth.registrarConductor);

rutas.post('/register/admin',
    [limit.l60s5r, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
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

export default rutas