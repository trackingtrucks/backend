const express = require('express');
const rutas = express.Router();

const { root } = require('./Mock.functions')


rutas.get('/ola', root); 

module.exports = rutas;