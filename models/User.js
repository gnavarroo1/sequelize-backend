'use strict';
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        nombre: {
            type: DataTypes.STRING,
            allowNull:false
        },
        email: {
            type: DataTypes.STRING,
            allowNull:false
        },
        password: {
            type: DataTypes.STRING,
            allowNull:false
        },
        nrodocumento: {
            type: DataTypes.STRING,
            allowNull:false
        },
        tipoUsuario:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        imagen:{
            type: DataTypes.STRING
        }
    });
    return user;
}