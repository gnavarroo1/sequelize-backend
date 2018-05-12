'use strict';
module.exports = function (sequelize, DataTypes) {
    var category = sequelize.define('category', {
        nombre: {
            type: DataTypes.STRING,
            allowNull:false
        },
        
    });
    
    return category;
}