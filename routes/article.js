'use strict'
var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);


//Rutas de utiles
router.post('/save', ArticleController.save);

//Se agrega un parametro opcional con ?
router.get('/articles/:last?', ArticleController.getAricles);

//Campo obligatorio
router.get('/article/:id', ArticleController.getAricle);
module.exports = router;