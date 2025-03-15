const rateLimit = {};
const cooldown = process.env.COUPON_COOLDOWN || 300;

module.exports = (req, res, next) => {
  const ip = req.ip;
  if (rateLimit[ip] && (Date.now() - rateLimit[ip]) < cooldown * 1000) {
    return res.status(429).json({ message: "Please wait before claiming again." });
  }
  rateLimit[ip] = Date.now();
  next();
};
