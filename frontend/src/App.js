import React, { useState } from "react";
import "./index.css";

const App = () => {
  const [coupon, setCoupon] = useState(null);
  const [error, setError] = useState(null);

  const handleClaimCoupon = async () => {
    try {
      console.log("Claim button clicked!"); // ✅ Debugging

      const response = await fetch("https://coupouns-backend-j1n0z4n3w-hiral-jains-projects.vercel.app/claim", { 
        method: "POST", 
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      

      console.log("Response received:", response); // ✅ Debugging

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setCoupon(data.coupon);
      setError(null);
    } catch (error) {
      console.error("Error:", error); // ✅ Debugging
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Round-Robin Coupon Distribution</h1>
      <p>Click the button to claim your coupon.</p>
      <button className="button" onClick={handleClaimCoupon}>Claim Coupon</button>

      {coupon && <p className="success">🎉 Your coupon: {coupon}</p>}
      {error && <p className="error">❌ {error}</p>}
    </div>
  );
};

export default App;
