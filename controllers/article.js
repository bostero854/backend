'use strict'

var validator = require('validator');
const article = require('../models/article');
var Articulo = require('../models/article');

var controller = {

    datosCurso:(req,res)=>{
        var param= req.body.hola;
        return res.status(200).send({
            curso:'programacion 3',
            autor:'benedicto paco o',
            url:'www.nslp.com.ar',
            param});
    },
    test:(req,res)=>{

        return res.status(200).send(
            {
                message:'Soy la accion test de mi controlador de articulos'
            });
    },
    save:(req,res)=>{

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
                message:'Faltan datos por enviar'
            });
        }    

        if(validate_title && validate_content){

            console.log('Validacion conrrecta');

            //Crear el objeto a guardar
            var article = new Articulo();

            //Asingar valores al objeto
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            console.log(article);

            //Guardar en la base de datos
            article.save((err,articleStore)=>{

                console.log(articleStore);
                if(err || !articleStore){
                    return res.status(404).send({
                        status: 'Error',
                        message:'El articulo no se guardo!!'
                        
                    });

                }

                //Retorar respuesta
                return res.status(200).send({
                    status: 'success',
                    article:articleStore
                    
                });
            });


        }else{
            return res.status(200).send({
                status: 'Error',
                message:'Los datos no son validos'
            });
        }



        return res.status(200).send({
            article:params
        });
    },
    
    //Nuevo metodo get
    getAricles:(req,res)=>{

        var last = req.params.last;
        var query = Articulo.find({});
        
        if(last || last != undefined){
            //Limitamos la cantidad de datos a retornar con query.limit
            query.limit(5);

        }

        //se usa para ordenar sort por el campo del json que tenemos en la base de datos
        query.sort('-_id').exec((err,articles)=>{

            if(err){
                return res.status(500).send({
                    status: 'Error',
                    message:'Error al devolver los articulos'
                });  

            }
            if(!articles){
                return res.status(404).send({
                    status: 'success',
                    message:'No hay articulos para mostrar'
                });  

            }

            //Si no hay error va a retornar todos los articulos
            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    }

};

module.exports = controller;

