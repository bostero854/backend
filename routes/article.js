'use strict'
var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multipaty = require('connect-multiparty');

var md_upload = multipaty({uploadDir:'./upload/articles'});

//Rutas de prueba
router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//Rutas de utiles
router.post('/save', ArticleController.save);

//Se agrega un parametro opcional con ?
router.get('/articles/:last?', ArticleController.getAricles);

// parametros obligatorios
router.get('/article/:id', ArticleController.getAricle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id',md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;