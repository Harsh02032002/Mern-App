import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { loadStripe } from "@stripe/stripe-js";
import { FaCcStripe, FaPaypal, FaUniversity } from "react-icons/fa";
import { SiRazorpay, SiPaytm } from "react-icons/si";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Component ke top me

const Cart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(3).fill(null);
  const [showGatewayDropdown, setShowGatewayDropdown] = useState(false);
  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
    });

    const responseData = await response.json();
    if (responseData.success) setData(responseData.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ _id: id, quantity: qty + 1 }),
    });
    const responseData = await response.json();
    if (responseData.success) fetchData();
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _id: id, quantity: qty - 1 }),
      });
      const responseData = await response.json();
      if (responseData.success) fetchData();
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const handlePayment = async () => {
    const stripePromise = await loadStripe(
      process.env.REACT_APP_STRIPE_PUBLIC_KEY
    );
    const response = await fetch(SummaryApi.payment.url, {
      method: SummaryApi.payment.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cartItems: data }),
    });

    const responseData = await response.json();
    if (responseData?.id)
      stripePromise.redirectToCheckout({ sessionId: responseData.id });
  };
const handleGatewayPayment = async (gateway) => {
  setShowGatewayDropdown(false);

  if (gateway === "razorpay") {
    try {
      // Backend se Razorpay order create karna
      const response = await fetch(SummaryApi.razorpayCheckout.url, {
        method: SummaryApi.razorpayCheckout.method,
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice, // total cart price
          userId: context.user?._id, // current user
          products: data, // cart items
        }),
      });


      const orderData = await response.json();
      if (!orderData.success) {
        alert("Failed to create Razorpay order");
        return;
      }

      // Razorpay checkout options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // .env me test key
        amount: orderData.amount, // paise me (100 INR = 10000)
        currency: "INR",
        name: "KinBech.com",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          const verifyRes = await fetch(SummaryApi.verifyRazorpay.url, {
            method: SummaryApi.verifyRazorpay.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              ...response,
              userId: context.user?._id,
              email: context.user?.email,
              cartItems: data,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // ✅ Redirect to Success page
            navigate(`/success?paymentId=${response.razorpay_payment_id}`);
          } else {
            alert("❌ Payment Verification Failed");
          }
        },

        prefill: {
          name: "Buddy User",
          email: "buddy@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      alert("Something went wrong");
    }
  }
};


  const totalQty = data.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = data.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Empty State */}
      {data.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <MdShoppingCart size={60} className="text-gray-400 mb-4" />
          <p className="text-lg font-medium">Your cart is empty</p>
          <button className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition">
            Continue Shopping
          </button>
        </div>
      )}

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {loading
            ? loadingCart.map((_, i) => (
                <div
                  key={i}
                  className="w-full h-32 bg-slate-200 animate-pulse rounded-xl"
                ></div>
              ))
            : data.map((product) => (
                <div
                  key={product._id}
                  className="grid grid-cols-[120px,1fr,80px] items-center bg-white rounded-xl shadow-md hover:shadow-lg transition"
                >
                  {/* Image */}
                  <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-l-xl">
                    <img
                      src={product?.productId?.productImage[0]}
                      alt={product?.productId?.productName}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {product?.productId?.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {product?.productId?.category}
                    </p>

                    {/* Price + Qty */}
                    <div className="flex items-center justify-between">
                      <p className="text-red-600 font-medium">
                        {displayINRCurrency(product?.productId?.sellingPrice)}
                      </p>
                      <p className="text-gray-700 font-semibold">
                        {displayINRCurrency(
                          product?.productId?.sellingPrice * product.quantity
                        )}
                      </p>
                    </div>

                    {/* Qty Buttons */}
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() =>
                          decreaseQty(product._id, product.quantity)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="font-medium">{product.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQty(product._id, product.quantity)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="flex items-start justify-center pt-3 pr-3">
                    <button
                      onClick={() => deleteCartProduct(product._id)}
                      className="text-gray-400 hover:text-red-600 transition"
                    >
                      <MdDelete size={22} />
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Summary */}
        {data.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-xl p-5 space-y-4 sticky top-20">
              <h2 className="text-xl font-semibold border-b pb-2">
                Order Summary
              </h2>

              <div className="flex justify-between text-gray-600">
                <p>Total Items</p>
                <p>{totalQty}</p>
              </div>
              <div className="flex justify-between text-gray-600">
                <p>Total Price</p>
                <p>{displayINRCurrency(totalPrice)}</p>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handlePayment}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                >
                  💳 Pay with Card
                </button>
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => handleGatewayPayment("razorpay")}
                    className="w-full py-3 rounded-xl bg-green-600 text-white font-medium shadow hover:bg-green-700 transition "
                  >
                    🌐 Pay via Razorpay
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
