// controllers/payment/paypalController.js
const saveOrder = require("../../helpers/saveOrder");

const paypalWebhook = async (req, res) => {
  try {
    const { orderID, userId, email, cartItems } = req.body;

    // TODO: Verify orderID with PayPal API here

    const productDetails = cartItems.map(item => ({
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
        paymentId: orderID,
        gateway: "paypal",
        status: "paid",
      },
      totalAmount: productDetails.reduce((a, c) => a + c.price * c.quantity, 0),
    });

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = paypalWebhook;
