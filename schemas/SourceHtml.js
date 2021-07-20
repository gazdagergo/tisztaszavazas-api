import mongoose from 'mongoose';

const SourceHtmlSchema = mongoose.Schema({
  megyeKod: Number,
  telepulesKod: Number,
	szavkorSorszam: Number,
	url: String,
	html: String,
	area: Object
},
{
  timestamps: true
})

export default mongoose.model('SourceHtml', SourceHtmlSchema);