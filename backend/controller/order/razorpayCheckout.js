const razorpay = require("../../config/razorpay");

const razorpayCheckout = async (req, res) => {
  try {
    const { amount, currency = "INR", userId, products } = req.body;

    if (!amount || !userId || !products) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: { userId, products: JSON.stringify(products) },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = razorpayCheckout;
