const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const products = await Product.find().populate('dealerId', 'name');
  res.json(products);
});

router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ dealerId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const product = new Product({ ...req.body, dealerId: req.user.id });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.dealerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    if (product.dealerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    await product.remove();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;