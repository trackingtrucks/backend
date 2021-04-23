//import de libs
import { Router } from "express";
const rutas = Router();

//importar las funciones, se llaman con Mock.<Func>
import * as Mock from './Auth.mock.funcs'

//creamos la ruta, y le asignamos la funcion
rutas.all('/', Mock.auth.user)
rutas.all('/login', Mock.auth.login)
rutas.all('/register', Mock.auth.register)
rutas.all('/register.emailyaexiste', Mock.auth.error.emailyausado)
rutas.all('/login.contrainvalida', Mock.auth.error.wrongpassword)
rutas.all('/login.usuarioinvalido', Mock.auth.error.usernotfound)


export default rutas