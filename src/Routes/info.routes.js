import { Router } from "express";
const rutas = Router();
import * as Info from '../Controllers/info.controller.js'

rutas.all('/', Info.root)
rutas.all('/:coso', Info.specific)

export default rutas