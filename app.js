var createError = require('http-errors');
var express = require('express');
require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var registroRouter = require('./routes/registro');
var indexRouter = require('./routes/index');
var favoritosRouter = require('./routes/favoritos');
var recuperarRouter = require('./routes/recuperar');
var resetRouter = require('./routes/reset');

var app = express();
const session = require('express-session');

app.use(session({
    secret:  process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/recuperar', recuperarRouter);
app.use('/reset', resetRouter);

app.use('/', loginRouter);
app.use('/registro', registroRouter);
app.use('/index', indexRouter);
app.use('/users', require('./routes/users'));
app.use('/favoritos', favoritosRouter);

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
