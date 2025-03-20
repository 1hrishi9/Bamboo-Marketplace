const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: String,
});

module.exports = mongoose.model('Product', productSchema);