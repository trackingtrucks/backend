import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.delete('/account',
    [auth.verifyToken, auth.isAdmin, limit.l5m5r],
    Users.eliminar)

rutas.get('/getByCID',
    [auth.verifyToken, auth.isGestor],
    Users.getByCompanyId)
    
rutas.get('/', [auth.verifyToken, auth.isAdmin], Users.getAll)

    
export default rutas