const backendDomin = process.env.REACT_APP_BACKEND_URL; //"http://localhost:8080"

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },
  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomin}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "post",
  },
  payment: {
    url: `${backendDomin}/api/checkout`,
    method: "post",
  },
  getOrder: {
    url: `${backendDomin}/api/order-list`,
    method: "get",
  },
  allOrder: {
    url: `${backendDomin}/api/all-order`,
    method: "get",
  },
  // Wishlist APIs
  countWishlistProduct: {
    url: `${backendDomin}/api/countWishlistProduct`,
    method: "get",
  },
  addToWishlistProduct: {
    url: `${backendDomin}/api/add-to-wishlist`,
    method: "post",
  },
  viewWishlistProduct: {
    url: `${backendDomin}/api/view-wishlist`,
    method: "get",
  },
  deleteWishlistProduct: {
    url: `${backendDomin}/api/delete-wishlist-product`,
    method: "post",
  },
  updateWishlistProduct: {
    url: `${backendDomin}/api/update-wishlist-product`,
    method: "post",
  },
  // Payment Gateway APIs
  razorpayCheckout: {
    url: `${backendDomin}/api/checkout/razorpay`,
    method: "post",
  },
  paypalCheckout: {
    url: `${backendDomin}/api/checkout/paypal`,
    method: "post",
  },
  paytmCheckout: {
    url: `${backendDomin}/api/checkout/paytm`,
    method: "post",
  },
  gpayCheckout: {
    url: `${backendDomin}/api/checkout/gpay`,
    method: "post",
  },

  razorpayPayment: {
    url: `${backendDomin}/api/payment/razorpay`,
    method: "post",
  },
  paypalPayment: {
    url: `${backendDomin}/api/payment/paypal`,
    method: "post",
  },
  paytmPayment: {
    url: `${backendDomin}/api/payment/paytm`,
    method: "post",
  },
  gpayPayment: {
    url: `${backendDomin}/api/payment/gpay`,
    method: "post",
  },

  // Webhooks (mostly backend use, frontend rarely calls these directly)
  razorpayWebhook: {
    url: `${backendDomin}/api/webhook/razorpay`,
    method: "post",
  },
  paypalWebhook: {
    url: `${backendDomin}/api/webhook/paypal`,
    method: "post",
  },
  paytmWebhook: {
    url: `${backendDomin}/api/webhook/paytm`,
    method: "post",
  },
  gpayWebhook: {
    url: `${backendDomin}/api/webhook/gpay`,
    method: "post",
  },
  // Razorpay verify endpoint
  verifyRazorpay: {
    url: `${backendDomin}/api/payment/razorpay`,
    method: "post",
  },
};

export default SummaryApi;
