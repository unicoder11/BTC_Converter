var express = require("express"),
app = express(),
path = require('path'),
request = require("request"),
bodyParser = require("body-parser"),
mongoose = require('mongoose'),
bitcore = require('bitcore-lib'),
methodOverride = require('method-override');

var db = require('./connection/db');
var RegistroSchema = new mongoose.Schema({
	dateregistry: Date,
	btc: Number,
	pesos: Number,
	porcentaje: Number,
	ganancia: Number
});  
var RegData = mongoose.model('registros', RegistroSchema);

var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

module.exports = app;


function brainWallet(uinput, callback){

	var input = new Buffer(uinput);
	var hash = bitcore.crypto.Hash.sha256(input);
	var bn = bitcore.crypto.BN.fromBuffer(hash);
	var pk = new bitcore.PrivateKey(bn).toWIF();
	var addy = new bitcore.PrivateKey(bn).toAddress();
	callback(pk, addy);
};

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

app.get("/", function(req, res){
	getPrice(function(lastPrice){
	res.render("index", {
		lastPrice: lastPrice
		});
	});
});

app.get("/Buy_Btc", function(req, res){
	getPrice(function(lastPrice){
	res.render("Buy_Btc", {
		lastPrice: lastPrice
		});
	});
});

app.get("/Sell_Btc", function(req, res){
getPrice(function(lastPrice){
	res.render("Sell_Btc", {
		lastPrice: lastPrice
		});
	});
});

app.get("/Historial", function(req, res, next){
	RegData.find({}, function (err, registros) {
              if (err) {
                  return console.error(err);
              } else {
              	console.log(registros);
                  res.format({
                    html: function(){
                        res.render("Historial", {
                              title: 'Todos los Registros',
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
	res.render("Register_Saved", {});
});

app.post("/registros", function(req, res, next) {
        var dateregistry = req.body.dateregistry;
        var btc = req.body.btc;
        var pesos = req.body.pesos;
        var porcentaje = req.body.porcentaje;
        var ganancia = req.body.ganancia;
        RegData.create({
            dateregistry : dateregistry,
            btc : btc,
            pesos : pesos,
            porcentaje : porcentaje,
            ganancia : ganancia
        }, function (err, registro) {
        	console.log(registro);
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


app.post('/wallet', function(req, res){
	var brainsrc = req.body.brainsrc;
	console.log(brainsrc);
	brainWallet(brainsrc, function(priv, addr){
		res.send("The wallet of:" + brainsrc + "<br>Addy:" + addr + "<br>Private Key:" + priv);
	});
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
