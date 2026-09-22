const express = require("express");
const router = express.Router();
const Activity = require("../models/Activity");
const Product = require("../models/Product");

// @route   GET /api/recommendations/:userId
// @desc    Recommend available products from the user's most-active category.
//          Falls back to popular/random available products if user has no activity.
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await Activity.find({ userId });

    if (!activities || activities.length === 0) {
      // No activity yet -> show random available products
      const popular = await Product.aggregate([
        { $match: { availability: true } },
        { $sample: { size: 8 } },
      ]);
      return res.json({
        category: null,
        reason: "Popular picks for you to explore.",
        products: popular,
      });
    }

    // Count activity per category (FAVOURITE weighted higher than VIEW)
    const categoryScore = {};
    for (const act of activities) {
      const weight = act.activityType === "FAVOURITE" ? 2 : 1;
      categoryScore[act.category] = (categoryScore[act.category] || 0) + weight;
    }

    // Find category with the highest score
    let topCategory = null;
    let topScore = -1;
    for (const [cat, score] of Object.entries(categoryScore)) {
      if (score > topScore) {
        topScore = score;
        topCategory = cat;
      }
    }

    const recommended = await Product.find({
      category: topCategory,
      availability: true,
    }).limit(8);

    // If somehow nothing available in that category, fall back to random
    if (recommended.length === 0) {
      const popular = await Product.aggregate([
        { $match: { availability: true } },
        { $sample: { size: 8 } },
      ]);
      return res.json({
        category: null,
        reason: "Popular picks for you to explore.",
        products: popular,
      });
    }

    res.json({
      category: topCategory,
      reason: `Recommended because you recently viewed or favourited products in ${topCategory}.`,
      products: recommended,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error generating recommendations" });
  }
});

module.exports = router;
