const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const { name, description, price, stock, image, category } = req.body;
    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      category,
      dealerId: req.user.id,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    if (product.dealerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.stock = req.body.stock || product.stock;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'dealer') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    if (product.dealerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await product.remove();
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;