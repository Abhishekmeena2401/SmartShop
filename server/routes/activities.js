const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Product = require("../models/Product");

// @route   POST /api/activities
// @desc    Log a VIEW or FAVOURITE activity
router.post("/", async (req, res) => {
  try {
    const { userId, productId, activityType } = req.body;

    if (!userId || !productId || !activityType) {
      return res.status(400).json({ message: "userId, productId and activityType are required" });
    }
    if (!["VIEW", "FAVOURITE"].includes(activityType)) {
      return res.status(400).json({ message: "activityType must be VIEW or FAVOURITE" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const activity = new Activity({
      userId,
      productId,
      category: product.category,
      activityType,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error logging activity" });
  }
});

// @route   GET /api/activities/user/:userId
// @desc    Get all activity for a user (most recent first)
router.get("/user/:userId", async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("productId");
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching activity" });
  }
});

module.exports = router;
