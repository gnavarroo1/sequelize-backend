module.exports = function (app, express, cons, swig, path) {
  var constantes = require('./constants/constants');
  var logger = require('morgan');
  var bodyParser = require('body-parser');
  var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  }

  app.use(allowCrossDomain);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logger('dev'));
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  //conf engine swig
  app.engine('.html', cons.swig);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');


};