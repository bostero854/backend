'use strict'

var validator = require('validator');
var Articulo = require('../models/article');
var fs = require('fs');
var path = require('path');


var controller = {

    datosCurso: (req, res) => {
        var param = req.body.hola;
        return res.status(200).send({
            curso: 'programacion 3',
            autor: 'benedicto paco o',
            url: 'www.nslp.com.ar',
            param
        });
    },
    test: (req, res) => {

        return res.status(200).send(
            {
                message: 'Soy la accion test de mi controlador de articulos'
            });
    },
    save: (req, res) => {

        // Tomar los parametros por post
        var params = req.body;

        console.log(params);

        //Validar datos(Validator)
        try {

            //validamos que no este vacio
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);


        } catch (error) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content) {

            console.log('Validacion conrrecta');

            //Crear el objeto a guardar
            var article = new Articulo();

            //Asingar valores al objeto
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            console.log(article);

            //Guardar en la base de datos
            article.save((err, articleStore) => {

                console.log(articleStore);
                if (err || !articleStore) {
                    return res.status(404).send({
                        status: 'Error',
                        message: 'El articulo no se guardo!!'

                    });

                }

                //Retorar respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStore

                });
            });


        } else {
            return res.status(200).send({
                status: 'Error',
                message: 'Los datos no son validos'
            });
        }



        return res.status(200).send({
            article: params
        });
    },

    //Nuevo metodo get
    getAricles: (req, res) => {

        var last = req.params.last;
        var query = Articulo.find({});

        if (last || last != undefined) {
            //Limitamos la cantidad de datos a retornar con query.limit
            query.limit(5);

        }

        //se usa para ordenar sort por el campo del json que tenemos en la base de datos
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'Error',
                    message: 'Error al devolver los articulos'
                });

            }
            if (!articles) {
                return res.status(404).send({
                    status: 'success',
                    message: 'No hay articulos para mostrar'
                });

            }

            //Si no hay error va a retornar todos los articulos
            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    },
    getAricle: (req, res) => {

        //Tomar el id de la url
        var articleId = req.params.id;

        //Comprobar que exista
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'success',
                message: 'El articulo no existe!!!'
            });

        }

        //Busca el articulo
        Articulo.findById(articleId, (err, articles) => {

            if (err || !articles) {

                return res.status(500).send({
                    status: 'success',
                    message: 'El articulo no existe'
                });
            }

            //Envia respuesta json y devolverlo
            return res.status(200).send({
                status: 'success',
                articles
            });

        });



    },
    update: (req, res) => {
        //tomar el ud del articulo de la url
        var articleId = req.params.id;

        //tomanos los datos que llegan por put
        var params = req.body;

        //validar los datos
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (error) {
            return res.status(404).send({
                status: 'success',
                message: 'Faltan datos por enviar'
            });
        }


        if (validate_title && validate_content) {
            //find y update
            Articulo.findByIdAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'success',
                        message: 'Error al actulizar'
                    });

                }
                if (!articleUpdated) {
                    return res.status(400).send({
                        status: 'success',
                        message: 'No existe el articulo'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });

            });

        } else {
            return res.status(404).send({
                status: 'success',
                message: 'La validacion no es correcta'
            });
        }


    },
    delete: (req, res) => {//Se borra un articulo por id

        //tomar el ud del articulo de la url
        var articleId = req.params.id;

        //Find and delete
        Articulo.findOneAndDelete({ _id: articleId }, (err, articuleRemove) => {

            if (err) {
                return res.status(500).send({
                    status: 'success',
                    message: 'Error al borrar'
                });

            }
            if (!articuleRemove) {
                return res.status(404).send({
                    status: 'success',
                    message: 'El articulo no se ha borrado'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articuleRemove
            });

        });

    },
    upload: (req, res) => {


        //Configurar el modulo del connectMultiparty router/artcle.js



        //Tomar el archivo de la peticion que nos envian
        var file_Name = 'Imagen no subida...';
        console.log(req.files);

        if (!req.files) {
            return res.status(404).send({
                status: 'success',
                message: file_Name
            });

        }
        //Configurar el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // advertencia para linux o mac
        //var file_split = file_path.split('/');

        //Nombre del archivo
        var file_name = file_split[2];

        //Extension del archivo
        var extension_split = file_name.split('\.');

        var file_ext = extension_split[1];

        //Comprobar la extension -> solo, si no es valida borrar el archivo
        if (file_ext != 'png' &&
            file_ext != 'jpg' &&
            file_ext != 'git' &&
            file_ext != 'jpeg') {

            //Borrar el archivo subido
            //unlink nos permite borrar el archivo
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'Error',
                    message: 'la extension de la imagen no es valida'
                });
            });

        } else {
            //si esta tido bien y sacamos el id de la 
            var articleId = req.params.id;

            //Buscar el articulo, asignamos el nombre de la imagen y lo actulizo
            Articulo.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {


                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'success',
                        message: 'Error al guardar la imagen del articulo!!!'
                    });

                }


                return res.status(200).send({
                    status: 'success',
                    article: req.articleUpdated
                });
            });

            return res.status(200).send({
                fichero: req.files
            });
        }

    },
    getImage: (req, res) => {

        //obtengo el id de la imagen
        var file = req.params.image;


        //Sacar el path completo
        var path_fle = './upload/articles/' + file;
        console.log(path_fle);

        fs.exists(path_fle, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_fle));
            } else {
                return res.status(200).send({
                    status: 'Error',
                    message: 'La imagen no existe!!!'
                });
            }

        });


    },
    search: (req, res) => {
        //Sacar el string a buscar
        var searchString = req.params.search;

        console.log(searchString);

        //Find or
        Articulo.find({
            "or": [
                { 'title': { '$regex': searchString, '$options': 'i' } },
                { 'content': { '$regex': searchString, '$options': 'i' } }

            ]

        }).sort([['date','descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error en la peticion de busqueda!!!'
                    });

                }
                if (!articles) {

                    return res.status(404).send({
                        status: 'Error',
                        message: 'No hay articulos para mostrar!!!'
                    });
                }

                console.log(articles);
                return res.status(200).send({
                    status: 'success',
                    articles
                });
            });

    },
    //Ver el video https://nslp.com.ar/mod/page/view.php?id=35740&forceview=1
    //Ver el video https://nslp.com.ar/mod/page/view.php?id=35741&forceview=1
};

module.exports = controller;

