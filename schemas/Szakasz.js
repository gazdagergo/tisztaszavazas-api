import mongoose from 'mongoose';

const SzakaszSchema = mongoose.Schema({
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String
})

export default mongoose.model('Szakasz', SzakaszSchema);