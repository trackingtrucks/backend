import { Router } from "express";
const rutas = Router();
import * as Company from '../Controllers/company.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.post('/formulario', [verify.emailIsValid, verify.existeUsuarioOEmail], Company.nuevoForm) //Envia un nuevo formulario de registro

rutas.get('/', [auth.verifyToken, auth.isGestor], Company.getAllData); //Agarra toda la informacion de la compania
rutas.get('/user', [auth.verifyToken, auth.isGestor], Company.getUserByIdInsideCompany) //Agarra la informacion de un usuario en especifico (para alguna update de realtime)
rutas.get('/vehiculo', [auth.verifyToken, auth.isConductor], Company.getVehiculoByIdInsideCompany) //Agarra la informacion de un vehiculo en especifico (para alguna update de realtime)
rutas.get('/user/turnos', [auth.verifyToken, auth.isConductor], Company.getCurrentUserData) // Agarra los turnos del usuario actual
rutas.post("/alertas", [auth.verifyTokenWithCompanyData, auth.onlyGestor], Company.updateAlertas)
export default rutas