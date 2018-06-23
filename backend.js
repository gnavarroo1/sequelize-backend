var express = require('express'),
  app = express(),
  server = require('http'),
  cons = require('consolidate'),
  Sequelize = require('sequelize'),
  nunjucks = require('nunjucks'),
  path = require('path')
var config = require('../config.js')(app, express, cons, nunjucks, path);
var constantes = require('../constants/constants');
var multer = require('multer');
var rootDir = '';
var dir ='images/uploads/';
var filesDir = '/var/www/html/images/uploads';
// var filesDir = 'D:/repositorio/ecommerce/src/images/uploads';

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
      nombre: "Deportes"
    },
    {
      id: 2,
      nombre: "Cine"
    },
    {
      id: 3,
      nombre: "Teatro"
    },
    {
      id: 4,
      nombre: "Conciertos"
    }
  ];
  models.Category.bulkCreate(categorias).then(() => {

  }).catch((err) => {
    console.log(err);
  })
};

// agregar/actualizar cambios d tabla a base d datos -> sync(forced : true ) = drop and create table
sequelize.sync({}).then(() => {
  models.Category.count().then(c => {
    if (c === 0) {
      createCategoriesBatch();
    }
  })

});


//@controllers

//@functionCallbacks

//@routes
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
    res.json({
      fileName:req.file.filename,
      filePath: dir,
      status: 200
    });
  }
});

//configuracion normal
var puerto = constantes.var_configuracion.PUERTO_NODE;
var servidorApp = server.createServer(app).listen(puerto, function () {
  console.log('Express HTTP server listening on port ' + puerto);
});