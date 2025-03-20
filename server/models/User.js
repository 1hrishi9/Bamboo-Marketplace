const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['citizen', 'dealer', 'admin'], default: 'citizen' },
  phone: String,
  cart: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  // paymentGateway: { type: String, default: '' }, // Commented out for no Stripe
});

module.exports = mongoose.model('User', userSchema);