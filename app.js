var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');

var HttpRouter = require('./routes/index');

var app = express();

require('dotenv').load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret : 'author by zhang haon nan', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
    }
}));

HttpRouter(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);
server.listen(port);
server.on('listening', function () {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    var imageToAscii = require('image-to-ascii');
    var imgPath      = path.join(__dirname, 'public/img/sign.png');
    imageToAscii(imgPath, {
        size: {
            width: 30
        }
    }, function(err, converted) {
        console.log(err || converted);
        console.log('Server running at port ' + bind);
    });
});

module.exports = app;
