const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Product = require("../models/Product");

// @route   GET /api/favourites/:userId
// @desc    Get a user's current favourite products
router.get("/:userId", async (req, res) => {
  try {
    const favActivities = await Activity.find({
      userId: req.params.userId,
      activityType: "FAVOURITE",
    }).sort({ createdAt: -1 });

    // De-duplicate by productId, keep only the products that still exist
    const seen = new Set();
    const productIds = [];
    for (const act of favActivities) {
      const id = act.productId.toString();
      if (!seen.has(id)) {
        seen.add(id);
        productIds.push(act.productId);
      }
    }

    const products = await Product.find({ _id: { $in: productIds } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching favourites" });
  }
});

// @route   POST /api/favourites
// @desc    Toggle favourite for a product (add if not favourited, remove if already favourited)
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    const existing = await Activity.findOne({
      userId,
      productId,
      activityType: "FAVOURITE",
    });

    if (existing) {
      await Activity.deleteOne({ _id: existing._id });
      return res.json({ favourited: false, message: "Removed from favourites" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Activity.create({
      userId,
      productId,
      category: product.category,
      activityType: "FAVOURITE",
    });

    res.status(201).json({ favourited: true, message: "Added to favourites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error toggling favourite" });
  }
});

module.exports = router;
