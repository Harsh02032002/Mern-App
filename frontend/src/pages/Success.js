import React, { useEffect, useState } from "react";
import SUCCESSIMAGE from "../assest/success.gif";
import { Link, useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [orderSaved, setOrderSaved] = useState(false);
  const [error, setError] = useState(null);

  // Stripe ke liye session_id, Razorpay ke liye orderId
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const saveOrder = async () => {
      try {
        let res;

        if (sessionId) {
          // ✅ Stripe ka flow
          res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/webhook`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );
        } else if (orderId) {
          // ✅ Razorpay ka flow
          res = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/order/${orderId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
        }

        if (!res || !res.ok) {
          const text = res ? await res.text() : "No response";
          throw new Error(text || "Failed to save/fetch order");
        }

        const data = await res.json();
        console.log("Order success:", data);
        setOrderSaved(true);
      } catch (err) {
        console.error("Error saving/fetching order:", err);
        setError(err.message || "Something went wrong");
      }
    };

    if (sessionId || orderId) {
      saveOrder();
    }
  }, [sessionId, orderId]);

  return (
    <div className="bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 m-2 rounded">
      <img src={SUCCESSIMAGE} width={150} height={150} alt="success" />
      <p className="text-green-600 font-bold text-xl">Payment Successful 🎉</p>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {orderSaved && (
        <p className="text-green-700 mt-2">Order saved successfully!</p>
      )}

      <Link
        to={"/order"}
        className="p-2 px-3 mt-5 border-2 border-green-600 rounded font-semibold text-green-600 hover:bg-green-600 hover:text-white"
      >
        See Order
      </Link>
    </div>
  );
};

export default Success;
