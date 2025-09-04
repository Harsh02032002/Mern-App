const gpayCheckout = async (req, res) => {
  try {
    const { amount, userId, products } = req.body;

    const upiLink = `upi://pay?pa=${process.env.GPAY_UPI_ID}&pn=EcommerceShop&am=${amount}&cu=INR&tn=Order%20Payment`;

    res.status(200).json({
      success: true,
      upiLink,
      message: "Redirect user to this UPI link to complete payment",
    });
  } catch (error) {
    console.error("GPay Checkout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = gpayCheckout;
