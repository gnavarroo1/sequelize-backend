var express = require('express'),
  app = express(),
  server = require('http'),
  cons = require('consolidate'),
  Sequelize = require('sequelize'),
  swig = require('swig'),
  fs = require('fs'),
  https = require('https'),
  path = require('path'),
  errores = require('../error')
var config = require('../config.js')(app, express, cons, swig, path);
var constantes = require('../constants/constants');
var multer = require('multer');
var filesDir = '/var/www/html/images/uploads';
//
function mkdirParent(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function (error) {
    //When it fail in this way, do the custom steps
    if (error && error.code === 'ENOENT') {
      //Create all the parents recursively
      mkdirParent(path.dirname(dirPath), mode,mkdirParent.bind(this, dirPath, mode, callback));
    } else if (callback) {
      //Manually run the callback since we used our own callback to do all these
      callback(error);
    }
  });
}


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(filesDir)) {
      mkdirParent(filesDir)
    }
    cb(null, filesDir)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== 'ico' && ext !== '.bmp') {
      req.fileValidationError = "Extension de archivo no valido";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  }
});

//nombre de bd - usuario - contraseña
//conexion a mysql
const sequelize = new Sequelize(constantes.bd.nombre, constantes.bd.usuario, constantes.bd.password, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  operatorsAliases: false
});

sequelize.authenticate().then(() => {})
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
//Inicializar modelos
var models = {};
models.sequelize = sequelize;
models.Sequelize = Sequelize;
models.User = require('../models/User')(sequelize, Sequelize);
models.Category = require('../models/Category')(sequelize, Sequelize);
models.Product = require('../models/Product')(sequelize, Sequelize, models);
models.Product.belongsTo(models.User, {
  foreignKey: 'userId',
  targetkey: 'id'
});
models.User.hasMany(models.Product);
models.Product.belongsTo(models.Category, {
  foreignKey: 'categoryId',
  targetkey: 'id'
});
models.Category.hasMany(models.Product);
module.exports = models;

function createCategoriesBatch() {
  var categorias = [{
      id: 1,
      nombre: "Cereales"
    },
    {
      id: 2,
      nombre: "Tubérculos"
    },
    {
      id: 3,
      nombre: "Legumbres"
    },
    {
      id: 4,
      nombre: "Hortalizas"
    },
    {
      id: 5,
      nombre: "Frutas"
    }, {
      id: 6,
      nombre: "Oleaginoza"
    }
  ];
  models.Category.bulkCreate(categorias).then(() => {

  }).catch((err) => {
    console.log(err);
  })
};

// agregar/actualizar cambios d tabla a base d datos -> sync(forced = true ) = drop and create table
sequelize.sync({}).then(() => {
  models.Category.count().then(c => {
    if (c === 0) {
      createCategoriesBatch();
    }
  })

});


var controller_cart    = require('./c_cart.js')(models)
var controller_category    = require('./c_category.js')(models)
var controller_product    = require('./c_product.js')(models)
var controller_user    = require('./c_user.js')(models)

var testconnection = function(req, res) {
	controller_category.testconnection(req, res);
}
var listCategories = function(req, res) {
	controller_category.listCategories(req, res);
}
var getProductDetailsById = function(req, res) {
	controller_product.getProductDetailsById(req, res);
}
var getAllProducts = function(req, res) {
	controller_product.getAllProducts(req, res);
}
var getProductsByCategory = function(req, res) {
	controller_product.getProductsByCategory(req, res);
}
var getProductsByFilter = function(req, res) {
	controller_product.getProductsByFilter(req, res);
}
var addProduct = function(req, res) {
	controller_product.addProduct(req, res);
}
var getUserProductsOffer = function(req, res) {
	controller_product.getUserProductsOffer(req, res);
}
var createUser = function(req, res) {
	controller_user.createUser(req, res);
}
var loginUser = function(req, res) {
	controller_user.loginUser(req, res);
}
var getUserDetails = function(req, res) {
	controller_user.getUserDetails(req, res);
}

app.get('/api/testconnection',testconnection);
app.get('/api/listCategories',listCategories);
app.post('/api/getProductDetailsById',getProductDetailsById);
app.get('/api/getAllProducts',getAllProducts);
app.post('/api/getProductsByCategory',getProductsByCategory);
app.get('/api/getProductsByFilter',getProductsByFilter);
app.post('/api/addProduct',addProduct);
app.post('/api/getUserProductsOffer',getUserProductsOffer);
app.post('/api/createUser',createUser);
app.post('/api/loginUser',loginUser);
app.post('/api/getUserDetails',getUserDetails);
app.get('/', function (req, res) {
  return res.send("hola mundo");
})

app.post('/api/fileUpload', upload.single('image'), (req, res) => {
  if (req.fileValidationError) {
    res.json({
      message: req.fileValidationError,
      status: 300
    })
  } else {
    console.log(req.file);
    res.json({
      message: req.file.destination,
      status: 200
    });
  }
});

//configuracion normal
var puerto = constantes.var_configuracion.PUERTO_NODE;
var servidorApp = server.createServer(app).listen(puerto, function () {
  console.log('Express HTTP server listening on port ' + puerto);
});
