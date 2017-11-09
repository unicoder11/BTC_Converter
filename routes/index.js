var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/registros');

var RegistroSchema = new mongoose.Schema({
  hora: Date,
  btc: Number,
  pesos: Number,
  porcentaje: Number,
  ganancia: Number,
}, {collection: 'reg-data'});
var RegData = mongoose.model('RegData', RegistroSchema);



router.get('/views', function(req, res, next) {
  res.render('index');
  		});

router.get('/get-data', function(req, res, next) {
  RegData.find()
    .then(function(doc) {
      res.render('index', {items: doc});
    });
});

router.post('/insert', function(req, res, next) {
  var item = {
    nombre: req.body.nombre,
    hora: req.body.Date,
    btc: req.body.btc,
    pesos: req.body.pesos,
    porcentaje: req.body.porcentaje,
    ganancia: req.body.ganancia
  };
  var data = new RegData(item);
  data.save();
  res.redirect('/');
});

router.post('update', function(req, res, next) {
  var item = {
    nombre: req.body.nombre,
    hora: req.body.Date,
    btc: req.body.btc,
    pesos: req.body.pesos,
    porcentaje: req.body.porcentaje,
    ganancia: req.body.ganancia
  }
  var id = req.body.id;
  RegData.findById(id, function(er, doc) {
    if (err) {
      console.error(' error, no entry found');
    }
//    doc.nombre = req.body.nombre;
//    doc.hora = req.body.Date;
    doc.btc = req.body.btc;
    doc.pesos = req.body.pesos;
    doc.porcentaje = req.body.porcentaje;
    doc.ganancia = req.doby.ganancia;
    doc.save();
  });
  res.redirect('/');
});
router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  RegData.findByIdAndRemove(id).exec();
  res.redirect('/');
});
module.exports = router;
