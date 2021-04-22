import { Router } from "express";
const rutas = Router();
import * as Users from '../Controllers/user.controller'
import {auth, verify} from '../Middlewares/index'

rutas.post('/', [
    auth.verifyToken,
    auth.isAdmin,
    verify.Roles
], Users.crear)

export default rutas