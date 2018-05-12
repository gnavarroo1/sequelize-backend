
var express = require('express'),  app = express(),  server = require('http'),  cons = require('consolidate'),  Sequelize = require('sequelize'),  swig = require('swig'),  fs = require('fs'),  https = require('https'),  path = require('path'),  errores = require('../error'),  connection = '';var config = require('../config.js')(app, express, cons, swig, path);var constantes = require('../constants/constants');//nombre de bd - usuario - contraseña///////// conexion a mysqlconst sequelize = new Sequelize('tdp', 'root', 'root', {  host: 'localhost',  port: 3306,  dialect: 'mysql',  operatorsAliases: false});sequelize.authenticate().then(() => {      })  .catch(err => {    console.error('Unable to connect to the database:', err);  });////var models = {};models.sequelize = sequelize;models.Sequelize = Sequelize;models.User = require('../models/User')(sequelize, Sequelize);models.Category = require('../models/Category')(sequelize, Sequelize);models.Product = require('../models/Product')(sequelize, Sequelize,models);models.Product.belongsTo(models.User,{foreignKey:'userId',targetkey:'id'});models.User.hasMany(models.Product);models.Product.belongsTo(models.Category,{foreignKey:'categoryId',targetkey:'id'});models.Category.hasMany(models.Product);module.exports = models;// //@controllers// //@functionCallbacksfunction createCategoriesBatch() {  var categorias = [{      id: 1,      nombre: "Cereales"    },    {      id: 2,      nombre: "Tubérculos"    },    {      id: 3,      nombre: "Legumbres"    },    {      id: 4,      nombre: "Hortalizas"    },    {      id: 5,      nombre: "Frutas"    }, {      id: 6,      nombre: "Oleaginoza"    }  ];  models.Category.bulkCreate(categorias).then(() => {      }).catch((err) => {    console.log(err);  })};sequelize.sync({}).then(() => {  // Table created  models.Category.count().then(c =>{    if(c === 0)    {      createCategoriesBatch();    }  })  });// //@routesapp.get('/', function (req, res) {})var controller_cart    = require('./c_cart.js')(models)
=======
var express = require('express'),
  app = express(),
  server = require('http'),
  cons = require('consolidate'),
  Sequelize = require('sequelize'),
  swig = require('swig'),
  fs = require('fs'),
  https = require('https'),
  path = require('path'),
  errores = require('../error'),
  connection = '';
var morgan = require('morgan');
var bodyParser = require('body-parser');
var config = require('../config.js')(app, express, cons, swig, path);
var constantes = require('../constants/constants');
var multer = require('multer');
multer({
  fileFilter: function (req, file, cb) {
    var filetypes = /jpeg|jpg|png|gif|ico|bmp/;
    var mimetype = filetypes.test(file.mimetype);
    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: File upload only supports the following filetypes - " + filetypes);
  }
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({
  storage: storage
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

var controller_cart    = require('./c_cart.js')(models)
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
//Router para las Apis.var router = express.Router();////////////////configuracion normalvar puerto = constantes.var_configuracion.PUERTO_NODE;var servidorApp = server.createServer(app).listen(puerto, function () {  console.log('Express HTTP server listening on port ' + puerto);});
=======
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {})

//Router para las Apis.
var router = express.Router();
app.post('/api/fileUpload', upload.single('image'), (req, res, next) => {
  res.json({
    'message': req.file.path
  });
});

/*
//configuracion para servidor clusterizado d node
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
  // Fork workers.
  var a = numCPUs;
  for (let i = 0; i < a; i++) {
    cluster.fork();
  }
  cluster.on('online', function (worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
  });

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  //Workers can share any TCP connection
  //In this case it is an HTTP server
  //Get port from environment and store in Express.
  //app.all('/*', function(req, res) {
  //res.send('process ' + process.pid + ' says hello!').end();}   );
    var puerto = constantes.var_configuracion.PUERTO_NODE;
    var servidorApp = server.createServer(app).listen(puerto, function() {
    console.log('Express HTTP server listening on port ' + puerto);   });
 }
  console.log(`Worker ${process.pid} started`);
*/
//configuracion normal

var puerto = constantes.var_configuracion.PUERTO_NODE;
var servidorApp = server.createServer(app).listen(puerto, function () {
  console.log('Express HTTP server listening on port ' + puerto);
});
>>>>>>> Stashed changes
