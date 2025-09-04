const stripe = require("../../config/stripe");
const userModel = require("../../models/userModel");

const paymentController = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const user = await userModel.findOne({ _id: req.userId });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      shipping_options: [{ shipping_rate: "shr_1S0evBInTlFROsfThMytXgIz" }],
      customer_email: user.email,
      metadata: { userId: req.userId },
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.productName,
            images: item.productId.productImage,
            metadata: { productId: item.productId._id },
          },
          unit_amount: item.productId.sellingPrice * 100,
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
      success: false,
    });
  }
};

module.exports = paymentController;
