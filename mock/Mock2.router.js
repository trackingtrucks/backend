const express = require('express');
const rutas = express.Router();

const { root } = require('./Mock.functions')


rutas.get('/', root); 

module.exports = rutas;