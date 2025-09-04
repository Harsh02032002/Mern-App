import React, { createContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartProductCount, setCartProductCount] = useState(0);
  const[wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchUserWishlistCount = async () => {
    try {
      const res = await fetch(SummaryApi.userWishlistCount.url, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setWishlistCount(data.count);
        setWishlistItems(data.items); // yahan ids ya products aa sakte hain
      }
    } catch (err) {
      console.error("Failed to fetch wishlist count", err);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      toast.error("User fetch failed");
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setCartProductCount(data?.data?.count || 0);
      }
    } catch (error) {
      toast.error("Cart count failed");
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
    fetchUserWishlistCount();
  }, []);

  

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        cartProductCount,
        setCartProductCount,
        fetchUserDetails,
        fetchUserAddToCart,
        wishlistCount, // ✅ pass to context
        setWishlistCount,
        fetchUserWishlistCount,
        wishlistItems,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
