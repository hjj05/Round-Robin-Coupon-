const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: String,
  claimedBy: { type: String, default: null },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Coupon", couponSchema);
