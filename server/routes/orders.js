const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); // Add missing import

router.post('/checkout', auth, async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    // Validate product format
    for (const item of products) {
      if (!item.productId || !item.quantity) {
        return res.status(400).json({ msg: 'Invalid product format in cart' });
      }
    }

    const order = new Order({
      userId: req.user.id,
      products,
    });
    await order.save();
    await Order.populate(order, { path: 'products.productId' });

    // Clear the user's cart
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.cart = [];
    await user.save();

    res.json(order);
  } catch (err) {
    console.error('Checkout error:', err); // Add error logging
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId');

    const dealerOrders = orders.filter((order) =>
      order.products.some((item) => item.productId.dealerId.toString() === req.user.id)
    );

    res.json(dealerOrders);
  } catch (err) {
    console.error('Get my-orders error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/my-orders/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const hasDealerProduct = order.products.some(
      (item) => item.productId.dealerId.toString() === req.user.id
    );
    if (!hasDealerProduct) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Update my-orders error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;