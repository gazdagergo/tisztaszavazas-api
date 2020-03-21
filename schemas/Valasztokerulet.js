import mongoose from 'mongoose';

const ValasztokeruletSchema = mongoose.Schema({
	"tipus": String,
	"leiras": String,
	"szam": Number
})

export default mongoose.model('Valasztokerulet', ValasztokeruletSchema);