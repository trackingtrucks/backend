import { Router } from "express";
const rutas = Router();
// import * as Data from '../Controllers/data.controller.js'

rutas.get('/', (req, res) => {
    res.send('Hola!')
})

export default rutas