const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.get('/analytics', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    if (user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/users/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'superadmin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;