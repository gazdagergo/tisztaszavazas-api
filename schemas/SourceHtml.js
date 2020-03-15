import mongoose from 'mongoose';

const SourceHtmlSchema = mongoose.Schema({
	szavkorSorszam: Number,
  kozigEgyseg: {
    type: Object,
    ref: 'KozigEgyseg'
  },	
	url: String,
	area: Object,
	html: String,
},
{
  timestamps: true
})

export default mongoose.model('SourceHtml', SourceHtmlSchema);