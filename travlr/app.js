var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');

// MODULE 2: routers now live in app_server/routes (MVC structure)
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');

var app = express();

// MODULE 2: view engine setup - views moved to app_server/views
app.set('views', path.join(__dirname, 'app_server', 'views'));

// MODULE 2: register the path for Handlebars partials (header, footer)
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// MODULE 2: index:false stops express.static from serving public/index.html for '/',
// so the home route (controller + HBS view) handles it. Other static pages still work.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// MODULE 2: register the new traveler route
app.use('/travel', travelRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
