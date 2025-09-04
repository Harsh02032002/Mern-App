// helpers/saveOrder.js
const orderModel = require("../models/orderProductModel");
const addToCartModel = require("../models/cartProduct");

async function saveOrder({
  userId,
  email,
  productDetails,
  paymentDetails,
  totalAmount,
}) {
  // Prevent duplicate orders
  const existingOrder = await orderModel.findOne({
    "paymentDetails.paymentId": paymentDetails.paymentId,
  });
  if (existingOrder) return existingOrder;

  const orderDetails = {
    productDetails,
    email,
    userId,
    paymentDetails,
    totalAmount,
  };

  const order = new orderModel(orderDetails);
  const savedOrder = await order.save();

  // Clear cart
  await addToCartModel.deleteMany({ userId });

  return savedOrder;
}

module.exports = saveOrder;
