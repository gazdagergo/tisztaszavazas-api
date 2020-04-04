import mongoose from 'mongoose';

const KozteruletSchema = mongoose.Schema({
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String,
})

export default mongoose.model('Kozterulet', KozteruletSchema);