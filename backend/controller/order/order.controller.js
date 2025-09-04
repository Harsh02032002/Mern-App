const stripe = require("../../config/stripe");
const orderModel = require("../../models/orderProductModel");
const addToCartModel = require("../../models/cartProduct");
const userModel = require("../../models/userModel");

// Helper function to extract product details from Stripe line items
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

// User-specific orders
const orderController = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const orderList = await orderModel
      .find({ userId: currentUserId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: orderList,
      message: "Order list",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || error, error: true });
  }
};


module.exports = orderController;
