//import de libs
import { Router } from "express";
const rutas = Router();

//importar las funciones, se llaman con Mock.<Func>
import * as Mock from './Mock.functions'

//creamos la ruta, y le asignamos la funcion
rutas.get('/', Mock.user) 


export default rutas