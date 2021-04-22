//import de libs
import { Router } from "express";
const rutas = Router();

//importar las funciones, se llaman con Mock.<Func>
import * as Mock from './Mock.functions'
import authRutasMock from './user.mock.routes.js'

//creamos la ruta, y le asignamos la funcion
rutas.get('/', Mock.root) 


//nesting routers
rutas.use('/auth', authRutasMock) 

export default rutas