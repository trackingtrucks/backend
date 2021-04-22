import { Router } from "express";
const rutas = Router();
import * as Auth from '../Controllers/auth.controller.js'
import {verify} from '../Middlewares/index'

rutas.post('/login', Auth.login)
rutas.post('/register', [verify.existeUsuarioOEmail, verify.Roles], Auth.register)

export default rutas