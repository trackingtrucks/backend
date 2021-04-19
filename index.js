//setup
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

//settings
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
const PORT = process.env.PORT || 5000;

//setup de la api
app.listen(PORT, () => console.log(`Server corriendo en el puerto ${PORT}`));

//conexion a la base de datos

//root directory 
app.get('/', (req, res) => {
    res.send("Oh, encontraste la api! Bueno, bienvenido, no toques nada porfi :)")
})
//import rutas

//rutas
