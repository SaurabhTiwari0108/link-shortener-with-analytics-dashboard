const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
  ip: { type: String },
  location: {
    country: String,
    region: String,
    city: String
  },
  device: { type: String },
  browser: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Click', ClickSchema);
