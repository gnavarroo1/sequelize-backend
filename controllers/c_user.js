//@controller controller_user models
module.exports = function (models) {
    // var contextualiza_error = "CarolinaJS: controller c_user.js ";
    var errores = require('../error');
    var constants = require('../constants/constants');
    var Sequelize = require('sequelize');
    const Op = Sequelize.Op;


    //@servlet post
    this.createUser = function (req, res) {
        var nombre = req.body.nombre;
        var nrodocumento = req.body.nrodocumento;
        var email = req.body.email;
        var password = req.body.password;
        var tipoUsuario = req.body.tipousuario;
        var imagen = req.body.image;
        var message = {
            nombre: "",
            nrodocumento: "",
            password: "",
            email: "",
            tipoUsuario:"",
            imagen:""
        }
        if (!validateFields(req.body, message)) {
            res.json({
                message: message,
                result: false,
                status: 300
            });
        } else {
            models.User.find({
                where: {
                    [Op.or]: [{
                            email: email
                        },
                        {
                            nrodocumento: nrodocumento
                        }
                    ]
                }
            }).then((user) => {
                if (user) {            
                    if (user.nrodocumento === nrodocumento) {
                        message.nrodocumento = "Documento ya registrado"
                    }
                    if (user.email === email) {
                        message.email = "Correo ya registrado"
                    }
                    res.json({
                        message: message,
                        result: false,
                        status: 300
                    });
                } else {
                    models.User.create({
                        nombre: nombre,
                        nrodocumento: nrodocumento,
                        email: email,
                        password: password,
                        tipoUsuario: tipoUsuario,
                        imagen: imagen
                    }).then(() => {
                        res.json({
                            result: true,
                            status: 200
                        });
                    }).catch((err) => {
                        console.log('Error in Inserting Record'+err);
                        res.json({
                            message: err,
                            result: false,
                            status: 500
                        })
                    })
                }
            }).catch((err) => {
                console.log('Error en la busqueda de entrada'+err);
                res.json({
                    message: err,
                    result: false,
                    status: 500
                });
            })
        }
    };

    //@servlet post
    this.loginUser = function (req, res) {
        var message={
        };
        models.User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            },
            attributes: ['id', 'nombre', 'email', "nrodocumento", "imagen", "tipoUsuario"]
        }).then(function (user) {
            if (user) {
                res.json({
                    message: message,
                    data: user,
                    result: true,
                    status: 200
                });
            } else {
                message.password = "Usuario o contraseña incorrecta" 
                res.json({
                    message: message,
                    result: true,
                    status: 300
                });
            }
        }).catch((err) => {
            console.log('Error en la busqueda de entrada'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            });
        })
    }

    //@servlet post
    this.getUserDetails = function (req, res) {
        models.User.findOne({
            where: {
                id: req.body.userId
            },
            attributes: ['id', 'nombre', "email", "nrodocumento", "imagen", "tipoUsuario","createdAt"]
        }).then((user) => {
            console.log(user);
            if (user) {
                res.json({
                    message: "",
                    data: user,
                    result: true,
                    status: 200
                })
            } else {
                res.json({
                    message: "No se encontro el usuario de id " + req.body.userId,
                    result: false,
                    status: 300
                })
            }
        }).catch((err) => {
            console.log('Error en la busqueda de entrada'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            });
        })
    }

    function validateFields(data, message) {
        var flag = true;
        if (data.nombre === undefined || data.nombre === null || data.nombre === "") {
            message.nombre = "El campo nombre debe especificar caracteres validos";
            flag = false;
        }
        if (data.nrodocumento === undefined || data.nrodocumento === null || data.nrodocumento === "") {
            message.nrodocumento = "El campo nrodocumento debe especificar caracteres validos";
            flag = false;
        }
        if (data.password === undefined || data.password === null || data.password === "") {
            message.password = "El campo password debe especificar caracteres validos";
            flag = false;
        }
        if (data.email === undefined || data.email === null || data.email === "") {
            message.email = "El campo email debe especificar caracteres validos";
            flag = false;
        }
        if (!(data.tipousuario === constants.tipo_usuario.natural || data.tipousuario === constants.tipo_usuario.juridica) || data.tipousuario === ""|| data.tipousuario === undefined || data.tipousuario === null) {
            message.tipoUsuario = "Valores no validos";
            flag = false;
        }
        return flag;
    }

    return this;
}