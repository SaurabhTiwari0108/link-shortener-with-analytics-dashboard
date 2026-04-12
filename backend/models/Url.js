const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiryDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Url', UrlSchema);
