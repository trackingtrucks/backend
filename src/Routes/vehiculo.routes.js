import { Router } from "express";
const rutas = Router();
import * as Vehiculo from '../Controllers/Vehiculo.controller.js'

rutas.get('/', (req, res) => {
    res.send('Hola!')
})

export default rutas