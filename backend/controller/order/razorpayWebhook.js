const saveOrder = require("../../helpers/saveOrder");

const razorpayWebhook = async (req, res) => {
  try {
    const payload = req.body; // Razorpay ka webhook payload

    const userId = payload.notes?.userId;
    const email = payload.email || payload.contact;
    const products = payload.notes?.products
      ? JSON.parse(payload.notes.products)
      : [];
    const totalAmount = payload.amount / 100;

    const paymentDetails = {
      paymentId: payload.payment_id || payload.id,
      payment_status: payload.status,
      payment_method_type: payload.method,
    };

    const order = await saveOrder({
      userId,
      email,
      productDetails: products,
      paymentDetails,
      totalAmount,
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = razorpayWebhook;
