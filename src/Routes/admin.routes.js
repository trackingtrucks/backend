import { Router } from "express";
const rutas = Router();
import { auth, verify, limit } from '../Middlewares/index';
import * as Admin from '../Controllers/admin.controller';

rutas.post('/register',
    [verify.emailIsValid, auth.verifyToken, auth.isAdmin, verify.existeUsuarioOEmail],
    Admin.registrar);

rutas.get('/formulario/all', [auth.verifyToken, auth.isAdmin], Admin.getForms)
rutas.post('/formulario/aceptar', [auth.verifyToken, auth.isAdmin], Admin.aceptarForm)
rutas.delete('/formulario/:id', [auth.verifyToken, auth.isAdmin], Admin.eliminarForm)

rutas.get('/codigo/gestor', [auth.verifyToken, auth.isAdmin], Admin.codigoGestor)
rutas.post('/codigo', [verify.emailIsValid, verify.existeUsuarioOEmail, auth.verifyToken, auth.isAdmin], Admin.codigoAdmins)


rutas.delete('/cuenta',
    [auth.verifyToken, auth.isAdmin],
    Admin.eliminarCuenta)

rutas.get('/cuentas', 
    [auth.verifyToken, auth.isAdmin],
    Admin.getUsuarios);

export default rutas