//import de libs
import { Router } from "express";
const rutas = Router();

//importar las funciones, se llaman con Mock.<Func>
import * as Mock from './Mock.functions'
// import authRutasMock from './Auth/Auth.mock.routes.js'

//creamos la ruta, y le asignamos la funcion
rutas.get('/', Mock.root)
rutas.get("/generar_error/:code", Mock.generarError)

//nesting routers
// rutas.use('/auth', authRutasMock)


export default rutas