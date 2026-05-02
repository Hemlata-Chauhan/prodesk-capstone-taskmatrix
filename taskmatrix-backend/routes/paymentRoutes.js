const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Pro Plan"
            },
            unit_amount: 50000 // ₹500
          },
          quantity: 1
        }
      ],

      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("STRIPE ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;