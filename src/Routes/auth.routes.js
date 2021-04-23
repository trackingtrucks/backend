import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import {auth, verify} from '../Middlewares/index'

rutas.post('/login', Auth.login)

rutas.post('/register/gestor', 
[auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
Auth.registrarGestor)

rutas.post('/register/conductor', 
[auth.verifyToken, auth.isGestor, verify.existeUsuarioOEmail], 
Auth.registrarConductor)

rutas.post('/register/admin', 
[auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
Auth.registrarAdmin)

export default rutas