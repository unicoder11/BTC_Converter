var mongoose = require('mongoose'); 

var RegistroSchema = new mongoose.Schema({
  hora: Date,
  btc: Number,
  pesos: Number,
  porcentaje: Number,
  ganancia: Number
});
mongoose.model('RegData', RegistroSchema);