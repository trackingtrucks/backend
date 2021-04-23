import { Router } from "express";
const rutas = Router();
import * as Debug from './debug.controller.js'
import {auth, verify} from '../Middlewares/index'


rutas.post('/registeradmin', 
[verify.existeUsuarioOEmail],
Debug.registrarAdmin)

export default rutas