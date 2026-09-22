const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

const VALID_CATEGORIES = [
  "Laptops",
  "Mobiles",
  "Earphones",
  "Headphones",
  "TVs",
  "ACs",
  "Refrigerators",
];

// @route   GET /api/products
// @desc    Get all products, with optional search & category filter
// @query   ?search=hp&category=Laptops
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// @route   GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching product" });
  }
});

// @route   POST /api/products
// @desc    Add new product (admin)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;

    if (!name || !description || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      image,
      availability: availability !== undefined ? availability : true,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error adding product" });
  }
});

// @route   PUT /api/products/:id
// @desc    Edit product / change availability (admin)
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, category, image, availability } = req.body;

    if (category && !VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(availability !== undefined && { availability }),
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating product" });
  }
});

// @route   DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting product" });
  }
});

module.exports = router;
