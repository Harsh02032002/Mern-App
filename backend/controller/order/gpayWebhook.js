const saveOrder = require("../../helpers/saveOrder");

const gpayWebhook = async (req, res) => {
  try {
    const payload = req.body; // GPay (Google Pay) webhook payload

    const userId = payload.merchantInfo?.merchantId;
    const email = payload.email || payload.payer?.email;
    const products = payload.products || [];
    const totalAmount = payload.transactionInfo?.totalPrice;

    const paymentDetails = {
      paymentId: payload.paymentMethodData?.tokenizationData?.token,
      payment_status: payload.status || "SUCCESS",
      payment_method_type: "gpay",
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
    console.error("GPay webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = gpayWebhook;
