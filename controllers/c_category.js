//@controller controller_category models
module.exports = function (models) {
    //ar contextualiza_error = "CarolinaJS: controller c_event.js ";
    var errores = require('../error');
    var constants = require('../constants/constants');
    // var mongoose = require('mongoose');


    //@servlet get
    this.testconnection = function (req, res) {
        res.json({
            result: true,
            status: 200
        })
    }

    //@servlet get
    this.listCategories = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        };
        models.Category.findAll({attributes: ['id','nombre']}).then(function (categories) {
            if (categories) {
                res.json({
                    message:"",
                    data:categories,
                    result: true,
                    status: 200
                });
            }else{
                res.json({
                    message:"Usuario o contraseña incorrecta",
                    result: true,
                    status: 300
                });
            }
        }).catch((err) => {
            
            res.json({
                message: err,
                result: false,
                status: 500
            })
        })

    }
    return this;
}