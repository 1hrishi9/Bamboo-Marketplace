const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

router.post('/checkout', auth, async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.cart = [];
    await user.save();

    res.json(order);
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/user-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error('Get user-orders error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/my-orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('products.productId');

    const dealerOrders = orders.filter((order) => {
      if (!order.products || !Array.isArray(order.products)) {
        console.warn(`Order ${order._id} has invalid products field:`, order.products);
        return false;
      }

      return order.products.some((item) => {
        if (!item.productId || !item.productId.dealerId) {
          console.warn(`Order ${order._id} has a product with undefined productId or dealerId:`, item);
          return false;
        }
        return item.productId.dealerId.toString() === user._id.toString();
      });
    });

    res.json(dealerOrders);
  } catch (err) {
    console.error('Get my-orders error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/my-orders/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const order = await Order.findById(req.params.id).populate('products.productId');
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    const hasDealerProduct = order.products.some((item) => {
      if (!item.productId || !item.productId.dealerId) {
        console.warn(`Order ${order._id} has a product with undefined productId or dealerId:`, item);
        return false;
      }
      return item.productId.dealerId.toString() === user._id.toString();
    });
    if (!hasDealerProduct) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const validStatuses = ['Pending', 'Accepted', 'Packing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ msg: 'Invalid status' });
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