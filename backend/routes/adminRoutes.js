const express = require("express");
const Admin = require("../models/Admin");
const Coupon = require("../models/Coupon");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
  res.json({ token });
});

router.get("/coupons", async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

router.post("/add-coupon", async (req, res) => {
  const { code } = req.body;
  const newCoupon = new Coupon({ code });
  await newCoupon.save();
  res.json({ message: "Coupon added" });
});

module.exports = router;
