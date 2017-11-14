var express = require('express'),
app = express(),
path = require('path'),
request = require('request'),
cookieParser = require('cookie-parser');
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
bitcore = require('bitcore-lib'),
methodOverride = require('method-override'),
passport = require('passport'),
expressSession = require('express-session');

app.use(expressSession({
	secret: 'mySecretKey',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var db = require('./connection/db');

var RegData = require("./models/register.js");
var UserData = require("./models/user.js");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname + '/public'))) ;

module.exports = app;

app.listen(3000, function(){
	console.log('app listen at port 3000');
});


function getPrice(returnPrice){
	request({
		url:" https://www.bitstamp.net/api/ticker/",
		json: true
			}, function(err, res, body){
			returnPrice(body.last);
			btcTimestamp = body.timestamp;
	});
};

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

app.get("/", function(req, res){
	res.render("index", { message: req.flash('message') });
});

app.get("/Buy_Btc", isAuthenticated, function(req, res){
	getPrice(function(lastPrice){
	res.render("Buy_Btc", {
		title: 'Buy BTC',
		firstName: req.user.firstName,
		lastPrice: lastPrice
		});
	});
});

app.get("/Sell_Btc", isAuthenticated, function(req, res){
getPrice(function(lastPrice){
	res.render("Sell_Btc", {
		title: 'Sell BTC',
		firstName: req.user.firstName,
		lastPrice: lastPrice
		});
	});
});

app.get("/Historial", isAuthenticated, function(req, res, next){
	RegData.find({}, function (err, registros) {
            if (err) {
                return console.error(err);
            } else {
                  res.format({
                    html: function(){
                        res.render("Historial", {
                            title: 'All Transactions',
							firstName: req.user.firstName,
                            "registros" : registros
                        });
                    },
                    json: function(){
                        res.json(registros);
                    }
                });
              }     
	});
});

app.get("/Register_Saved", function(req, res){
	res.render("Register_Saved", {
		text: 'Transaction saved succesfully',
		firstName: req.user.firstName
	});
});

app.post("/registros", function(req, res, next) {
		var type = req.body.type;
        var dateregistry = req.body.dateregistry;
        var btc = req.body.btc;
        var pesos = req.body.pesos;
        var porcentaje = req.body.porcentaje;
        var ganancia = req.body.ganancia;
        RegData.create({
        	type : type,
            dateregistry : dateregistry,
            btc : btc,
            pesos : pesos,
            porcentaje : porcentaje,
            ganancia : ganancia
        }, function (err, registro) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  res.format({
                    html: function(){
                        res.redirect("/Register_Saved");
                    },
                    json: function(){
                        res.json(registro);
                    }
                });
              }
        })
});

request({
	url:" http://api.bluelytics.com.ar/v2/latest",
	json: true
}, function(err, res, body){
	bluePrice = body.blue.value_avg;
});

function getBlue(returnBlue){
	request({
		url:" http://api.bluelytics.com.ar/v2/latest",
		json: true
			}, function(err, res, body){
			bluePrice = body.blue.value_avg;
	});
};

getBlue();


/* Login routes */

app.post('/login', passport.authenticate('login', {
	successRedirect: '/Buy_Btc',
	failureRedirect: '/',
	failureFlash : true  
}));

app.get('/signup', function(req, res){
	res.render('User_Register',{message: req.flash('message')});
});

app.post('/signup', passport.authenticate('signup', {
	successRedirect: '/Buy_Btc',
	failureRedirect: '/signup',
	failureFlash : true  
}));

app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
});