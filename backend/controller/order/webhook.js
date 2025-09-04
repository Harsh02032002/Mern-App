const stripe = require("../../config/stripe");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");

// Helper function to extract product details safely
async function getLineItems(lineItems) {
  let ProductItems = [];
  for (const item of lineItems?.data || []) {
    const product = await stripe.products.retrieve(item.price.product);
    ProductItems.push({
      productId: product.metadata.productId,
      name: product.name,
      price: item.price.unit_amount / 100,
      quantity: item.quantity,
      image: product.images,
    });
  }
  return ProductItems;
}

// Webhook-style endpoint for frontend after Stripe payment
const webhooks = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId missing" });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Stripe session not found" });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const productDetails = await getLineItems(lineItems);

    // Check userId exists in session metadata
    if (!session.metadata?.userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User ID missing in session metadata",
        });
    }

    // Prepare order details
    const orderDetails = {
      productDetails,
      email: session.customer_email,
      userId: session.metadata.userId,
      paymentDetails: {
        paymentId: session.payment_intent,
        payment_method_type: session.payment_method_types,
        payment_status: session.payment_status,
      },
      shipping_options: session.shipping_options?.map((s) => ({
        ...s,
        shipping_amount: s.shipping_amount / 100,
      })),
      totalAmount: session.amount_total / 100,
    };

    // Save order in DB
    const order = new orderModel(orderDetails);
    const saveOrder = await order.save();

    // Clear user's cart
    await addToCartModel.deleteMany({ userId: session.metadata.userId });

    res.status(200).json({ success: true, order: saveOrder });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = webhooks;
