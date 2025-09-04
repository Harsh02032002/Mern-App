// controllers/payment/gpayController.js
const saveOrder = require("../../helpers/saveOrder");

const gpayWebhook = async (req, res) => {
  try {
    const { txnId, status, userId, email, cartItems } = req.body;

    if (status !== "SUCCESS") {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
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
        paymentId: txnId,
        gateway: "gpay",
        status: "paid",
      },
      totalAmount: productDetails.reduce((a, c) => a + c.price * c.quantity, 0),
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = gpayWebhook;
