const saveOrder = require("../../helpers/saveOrder");

const paytmWebhook = async (req, res) => {
  try {
    const payload = req.body; // Paytm webhook payload

    const userId = payload.MID;
    const email = payload.CUST_ID || payload.email;
    const products = payload.ORDER_DETAILS || [];
    const totalAmount = payload.TXN_AMOUNT;

    const paymentDetails = {
      paymentId: payload.ORDERID,
      payment_status: payload.STATUS,
      payment_method_type: payload.PAYMENTMODE,
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
    console.error("Paytm webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = paytmWebhook;
