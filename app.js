'use strict'

//Cargar modulos de NODE pare crear el servidor
var express = require('express');

var bodyParser = require('body-parser');
//Ejecutar express para http
var app = express();

//Cargar archivos de rutas
var article_routes = require('./routes/article');

//Cargar middelwares--Se ejecuta antes
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Activar el cors


//Añadir prefijos a las rutas
app.use('/api/',article_routes);
//req = request
//res = response

    
//Exportar el modulo
module.exports=app;