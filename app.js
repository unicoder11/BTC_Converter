var express = require("express");
var app = express();
var path = require('path');
var request = require("request");
var bodyparser = require("body-parser");
var bitcore = require("bitcore-lib");

var db = require('./connection/db'),
schema = require('./connection/schema');

var app = express();
app.set("view engine", "ejs");

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
	console.log('go');
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

app.get("/Historial", function(req, res){
getPrice(function(lastPrice){
	res.render("Historial", {
		lastPrice: lastPrice
		});
	});
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
