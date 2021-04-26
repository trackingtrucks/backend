import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify, limit } from '../Middlewares/index'

rutas.delete('/account',
    [auth.verifyToken, auth.isAdmin, limit.l5m5r],
    Users.eliminar)

export default rutas