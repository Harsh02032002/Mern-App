// controllers/payment/razorpayController.js
const crypto = require("crypto");
const saveOrder = require("../../helpers/saveOrder");

const razorpayWebhook = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      email,
      cartItems,
    } = req.body;

    // Signature verify
    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const productDetails = cartItems.map((item) => ({
      productId: item.productId._id,
      name: item.productId.productName,
      price: item.productId.sellingPrice,
      quantity: item.quantity,
      image: item.productId.productImage,
    }));

    const order = await saveOrder({
      userId,
      email,
      productDetails,
      paymentDetails: {
        paymentId: razorpay_payment_id,
        gateway: "razorpay",
        status: "paid",
      },
      totalAmount: productDetails.reduce((a, c) => a + c.price * c.quantity, 0),
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = razorpayWebhook;
