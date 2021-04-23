import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import { auth, verify } from '../Middlewares/index'

rutas.delete('/account',
    [auth.verifyToken, auth.isAdmin],
    Users.eliminar)

export default rutas