import { Router } from "express";
const rutas = Router();
import { auth, verify, limit } from '../Middlewares/index';
import * as Admin from '../Controllers/admin.controller';

rutas.post('/register', [verify.emailIsValid, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail], Admin.registrar); //Registrar una cuenta nueva de admin

rutas.get('/formulario/all', [auth.verifyToken, auth.isAdmin], Admin.getForms) //Agarrar todos los forms
rutas.post('/formulario/aceptar', [auth.verifyToken, auth.isAdmin], Admin.aceptarForm) //Aceptar un form especifico
rutas.delete('/formulario/:id', [auth.verifyToken, auth.isAdmin], Admin.eliminarForm) //Elimina un form especifico

rutas.get('/codigo/gestor', [auth.verifyToken, auth.isAdmin], Admin.codigoGestor) //Crea un codigo de gestor (como admin) para cualquier empresa
rutas.post('/codigo', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.isAdmin], Admin.codigoAdmins) //Crea un codigo de registro para Admins

rutas.delete('/codigo', [auth.verifyToken, auth.isAdmin], Admin.elminarToken) //Elimina un codigo de registro
rutas.get('/codigos/admin', [auth.verifyToken, auth.isAdmin], Admin.getAdminTokens) //Agarra todos los codigos de registro activos
rutas.get('/cuentas/admins', [auth.verifyToken, auth.isAdmin], Admin.getAllAdmins) //Agarra todas las cuentas de admin activas

rutas.delete('/cuenta', [auth.verifyToken, auth.isAdmin], Admin.eliminarCuenta) //Elimina una cuenta especificada
rutas.get('/cuentas', [auth.verifyToken, auth.isAdmin], Admin.getUsuarios); //Agarra todas las cuentas del sistema

export default rutas