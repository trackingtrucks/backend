import { Router } from "express";
const rutas = Router();
import * as Productos from '../Controllers/products.controller.js'
import { auth } from '../Middlewares/index'

rutas.post('/', [auth.verifyToken, auth.isMod], Productos.crear)
rutas.get('/', Productos.get)
rutas.get('/:id', Productos.getById)
rutas.put('/:id', [auth.verifyToken, auth.isAdmin], Productos.update)
rutas.delete('/:id', [auth.verifyToken, auth.isAdmin], Productos.borrar)

export default rutas