var mongoose = require('mongoose'),
	RegisterSchema = new mongoose.Schema({
	type: String,
	dateregistry: Date,
	btc: Number,
	pesos: Number,
	porcentaje: Number,
	ganancia: Number
}),
	RegData = mongoose.model('registros', RegisterSchema);

module.exports = RegData;