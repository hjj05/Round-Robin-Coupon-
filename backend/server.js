const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // ✅ Fixed CORS placement
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Handle form data
app.use(cookieParser());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/couponsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ✅ Define Coupon Schema
const couponSchema = new mongoose.Schema({
  code: String,
  available: Boolean,
  claimedByIP: String,
  claimedAt: Date,
});

const Coupon = mongoose.model("Coupon", couponSchema);

const IP_CLAIM_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

// ✅ Claim Coupon API
app.post("/claim", async (req, res) => {
  const userIP = req.ip; // ✅ Use req.ip for accurate tracking
  const claimedCookie = req.cookies.claimedCoupon;

  // ✅ Check if IP has claimed a coupon within 24 hours
  const existingClaim = await Coupon.findOne({
    claimedByIP: userIP,
    claimedAt: { $gte: new Date(Date.now() - IP_CLAIM_TIMEOUT) },
  });

  if (existingClaim || claimedCookie) {
    return res.status(403).json({ message: "You have already claimed a coupon in the last 24 hours." });
  }

  // ✅ Find an available coupon
  const availableCoupon = await Coupon.findOne({ available: true });

  if (!availableCoupon) {
    return res.status(404).json({ message: "No available coupons." });
  }

  // ✅ Mark the coupon as claimed
  availableCoupon.available = false;
  availableCoupon.claimedByIP = userIP;
  availableCoupon.claimedAt = new Date();
  await availableCoupon.save();

  // ✅ Set a cookie for session tracking
  res.cookie("claimedCoupon", "true", { maxAge: IP_CLAIM_TIMEOUT, httpOnly: true });

  res.json({ message: "Coupon claimed successfully!", coupon: availableCoupon.code });
});

// ✅ Reset Coupon API (For Testing)
app.post("/reset", async (req, res) => {
  await Coupon.updateMany({}, { available: true, claimedByIP: null, claimedAt: null });
  res.clearCookie("claimedCoupon");
  res.json({ message: "All coupons reset!" });
});

// ✅ Start Server on Port 5000
const PORT = process.env.PORT || 5000; // 🔹 Changed from 3000 to 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
