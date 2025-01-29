"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [amount, setAmount] = useState(5000); // Default £50.00 (5000 pence)

  const handlePayment = async () => {
    try {
      const response = await axios.post("/api/pay", { amount });

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Failed to initialize payment");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>GoCardless Payment</h1>
      
      <label>
        Amount (£):
        <input
          type="number" 
          value={amount / 100} 
          onChange={(e) => setAmount(Number(e.target.value) * 100)} 
          style={{ marginLeft: "10px", padding: "5px", fontSize: "16px", color: "black" }}
        />
      </label>

      <br /><br />
      
      <button 
        onClick={handlePayment} 
        style={{ padding: "10px 20px", fontSize: "18px" }}>
        Pay £{(amount / 100).toFixed(2)}
      </button>
    </div>
  );
}
