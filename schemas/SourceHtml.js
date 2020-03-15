import mongoose from 'mongoose';

const SourceHtmlSchema = mongoose.Schema({
	szavkorSorszam: Number,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  },	
	vhuUrl: String,
	area: Object,
	html: String,
},
{
  timestamps: true
})

export default mongoose.model('SourceHtml', SourceHtmlSchema);