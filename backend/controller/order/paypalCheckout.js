const paypal = require("../../config/paypal");

const paypalCheckout = async (req, res) => {
  try {
    const { amount, currency = "USD", userId, products } = req.body;

    const createPaymentJson = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      },
      transactions: [
        {
          amount: { currency, total: amount },
          description: "E-commerce purchase",
          custom: JSON.stringify({ userId, products }),
        },
      ],
    };

    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        throw error;
      } else {
        const approvalUrl = payment.links.find((l) => l.rel === "approval_url");
        res.status(200).json({ success: true, approvalUrl: approvalUrl.href });
      }
    });
  } catch (error) {
    console.error("PayPal Checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = paypalCheckout;
