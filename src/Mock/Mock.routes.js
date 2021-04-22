import { Router } from "express";
const rutas = Router();

import * as Mock from './Mock.functions'


rutas.get('/', Mock.root) 

export default rutas