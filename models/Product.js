'use strict';
module.exports = function (sequelize, DataTypes) {
    var product = sequelize.define('product', {
        nombre: {
            type: DataTypes.STRING,
            allowNull:false
        },
        cantidad: {
            type: DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        preciounitario: {
            type: DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        imagen:{
            type: DataTypes.STRING
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        categoryId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },{
        version: true
    });
    

    return product;
}