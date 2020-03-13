import mongoose from 'mongoose';

const KozteruletSchema = mongoose.Schema({
	"telepulesNev": String,
	"leiras": String,
	"kozteruletNev": String,
	"kezdoHazszam": Number,
	"vegsoHazszam": Number,
	"megjegyzes": String,
})

export default mongoose.model('Kozterulet', KozteruletSchema);