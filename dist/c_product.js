//@controller controller_product models
module.exports = function (models) {
    // var contextualiza_error = "CarolinaJS: controller c_product.js ";
    var errores = require('../error');
    var constants = require('../constants/constants');
    var Sequelize = require('sequelize');
    const Op = Sequelize.Op;

    //@servlet post
    this.getProductDetailsById = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        }
        var id = req.body.productId;
        
        models.Product.findOne({
            include: [{
                model: models.User,
                attributes: ['nombre','email','nrodocumento','tipoUsuario']
                
            },{
                model: models.Category,
                attributes: ['nombre']
            }],
            where: {
                id: id
            },
            attributes:['nombre','descripcion','cantidad','preciounitario','imagen','createdAt']
        }).then(function (product) {
            if (product) {
                var producto = {
                    cantidad:product.cantidad,
                    createdAt: product.createdAt.toLocaleDateString("en-US"),
                    descripcion: product.descripcion,
                    imagen: product.imagen,
                    nombre: product.nombre,
                    preciounitario: product.preciounitario,
                    categoria: product.category.nombre,
                    userEmail: product.user.email,
                    userNombre: product.user.nombre,
                    userNroDoc: product.user.nrodocumento,
                    userTipoDoc: product.user.tipoUsuario === constants.tipo_usuario.juridica?"R.U.C":"D.N.I"
                };
                
                response.data.product = producto;
            } else {
                response.message = constants.tipo_mensaje.no_data;
            }
            res.send(response);
        }).catch((err) => {
            console.log('Error in Record'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        });
    }

    //@servlet get
    this.getAllProducts = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        }
        models.Product.findAll({
            include: [{
                model: models.User,
                attributes: ['nombre']
                
            },{
                model: models.Category,
                attributes: ['nombre']
            }]
        }).then(function (products) {
            if (products) {
                response.data.products = products;
                response.message = constants.tipo_mensaje.exito;
            } else {
                response.message = constants.tipo_mensaje.no_data;
                response.data.products = {};
            }
            
            res.send(response);
        }).catch((err) => {
            console.log('Error in Record'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        });
    }

    //@servlet post
    this.getProductsByCategory = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        }
        var ids = req.body.categoryIdsList;
        var searchFilter = req.body.searchString;
        models.Product.findAll({
            include: [{
                model: models.User,
                attributes: ['id', 'nombre']
                
            }],
            where: {
                categoryID: {
                    [Op.or]: ids
                },
                nombre: {
                    [Op.like]: searchFilter + "%"
                }
            }
        }).then(function (products) {
            if (products) {
                response.data.products = products;
            } else {
                response.message = constants.tipo_mensaje.no_data;
            }
            res.send(response);
        }).catch((err) => {
            console.log('Error in Record'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        });
    }

    //@servlet get
    this.getProductsByFilter = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        }
        var id = req.body.product_id;
        models.Product.findAll({
            include: [{
                model: models.User,
                attributes: ['id', 'nombre']
                
            }],
            where: {
                nombre: {
                    [Op.like]: "%" + req.body.filter + "%"
                }
            },
            include: {
                model: models.User,
                as: "user",
                through: {
                    attributes: ['id', 'nombre', 'apellidos', 'pais']
                }
            }
        }).then(function (products) {
            if (products) {
                response.data.products = products;
            } else {
                response.message = constants.tipo_mensaje.no_data;
            }
            res.send(response);
        }).catch((err) => {
            console.log('Error in Record'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        });
    }

    //@servlet post
    this.addProduct = function (req, res) {
        var product = req.body;
        console.log(product);
        models.Product.create({
            nombre: product.nombre,
            cantidad: product.cantidad,
            preciounitario: product.price,
            descripcion: product.descripcion,
            categoryId: product.categoryId,
            userId: product.userId
        }).then((p) => {
            res.json({
                result: true,
                status: 200
            });
        }).catch((err) => {
            console.log('Error in Inserting Record' + err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        })
    }

    //@servlet post
    this.getUserProductsOffer = function (req, res) {
        var response = {
            data: {},
            message: constants.tipo_mensaje.exito,
            message_detail: "",
            message_title: ""
        }
        var ids = req.body.userId;
        models.Product.findAll({
            where: {
                userID: ids
            }
        }).then(function (products) {
            if (products) {
                response.data.products = products;
            } else {
                response.message = constants.tipo_mensaje.no_data;
            }
            res.send(response);
        }).catch((err) => {
            console.log('Error in Record'+err);
            res.json({
                message: err,
                result: false,
                status: 500
            })
        });
    }
    return this;
}