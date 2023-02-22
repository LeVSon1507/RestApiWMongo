const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');
const authenticate = require('./authenticate');


// =========================connect===================
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//authen
app.use(passport.initialize());
app.use(passport.session());
function auth (req, res, next) {
      console.log(req.user);
      if (!req.user) {
        var err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
      }
      else {
            next();
      }
  }
  
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("12345-67890-09876-54321"));

function auth(req, res, next) {
  console.log(req.headers);
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return next({ status: 401, message: 'Unauthorized' });
    }

    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    if (username === 'admin' && password === '123') {
      res.cookie('user', 'admin', { signed: true });
      return next(); // authorized
    }
    return next({ status: 401, message: 'Unauthorized' });
  }
  
  if (req.signedCookies.user !== 'admin') {
    return next({ status: 401, message: 'Unauthorized' });
  }
  
  console.log('req.signedCookies: ', req.signedCookies);
  return next();
}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

// =============ROUTER==========================//
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leadersRoute = require('./routes/leaderRouter');
const usersRouter = require('./routes/users');
const indexRouter = require('./routes');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leadersRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
