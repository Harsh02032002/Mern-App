const saveOrder = require("../../helpers/saveOrder");

const paypalWebhook = async (req, res) => {
  try {
    const payload = req.body; // PayPal webhook payload

    const userId = payload.custom || payload.resource?.custom_id;
    const email = payload.payer?.email_address;
    const products = payload.resource?.purchase_units?.[0]?.items || [];
    const totalAmount = payload.resource?.amount?.value;

    const paymentDetails = {
      paymentId: payload.resource?.id,
      payment_status: payload.resource?.status,
      payment_method_type: "paypal",
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
    console.error("PayPal webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = paypalWebhook;
