const express = require("express");
const Coupon = require("../models/Coupon");
const preventAbuse = require("../middleware/protect");
const router = express.Router();

router.get("/claim", preventAbuse, async (req, res) => {
  const coupon = await Coupon.findOneAndUpdate(
    { claimedBy: null, isActive: true },
    { claimedBy: req.ip },
    { new: true }
  );

  if (!coupon) return res.status(404).json({ message: "No available coupons" });

  res.json({ message: "Coupon claimed!", coupon: coupon.code });
});

module.exports = router;
