'use strict'

//cargar modulos de NODE para crear el servidor
var express = require("express");

var bodyparser = require("body-parser");

//ejecutar express para el http
var app = express();

//Cargar archivos de rutas
var article_routes=require('./routes/article');

//Cargar middlewares
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//Cargar el cors 
//Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Añadir prefijos a las rutas
app.use("/api", article_routes);
// <>

//exportar el modulo
module.exports = app;