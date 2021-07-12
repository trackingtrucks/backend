import { Router } from "express";
const rutas = Router();
import * as Company from '../Controllers/company.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.get('/', [auth.verifyToken, auth.isGestor], Company.getAllData);
rutas.post('/formulario', [verify.emailIsValid, verify.existeUsuarioOEmail], Company.nuevoForm)
rutas.get('/user', [auth.verifyToken, auth.isGestor], Company.getUserByIdInsideCompany)
rutas.get('/vehiculo', [auth.verifyToken, auth.isConductor], Company.getVehiculoByIdInsideCompany)

export default rutas