const paytm = require("../../config/paytm");

const paytmCheckout = async (req, res) => {
  try {
    const { amount, userId, products } = req.body;

    const orderId = "ORDER_" + Date.now();

    const params = {
      MID: process.env.PAYTM_MID,
      WEBSITE: process.env.PAYTM_WEBSITE,
      INDUSTRY_TYPE_ID: process.env.PAYTM_INDUSTRY_TYPE,
      CHANNEL_ID: "WEB",
      ORDER_ID: orderId,
      CUST_ID: userId,
      TXN_AMOUNT: String(amount),
      CALLBACK_URL: `${process.env.BACKEND_URL}/api/webhook/paytm`,
    };

    const txnToken = await paytm.generateTxnToken(params);

    res.status(200).json({
      success: true,
      orderId,
      txnToken,
      amount,
    });
  } catch (error) {
    console.error("Paytm Checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = paytmCheckout;
