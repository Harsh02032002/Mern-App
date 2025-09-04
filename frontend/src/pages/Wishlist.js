import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import addToCart from "../helpers/addToCart"; // Cart helper

const Wishlist = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingWishlist = new Array(4).fill(null);

  const fetchData = async () => {
    try {
      const response = await fetch(SummaryApi.viewWishlistProduct.url, {
        method: SummaryApi.viewWishlistProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const text = await response.text(); // first read as text
      let responseData;

      try {
        responseData = JSON.parse(text); // parse only if valid JSON
      } catch (err) {
        console.error("Invalid JSON response:", text);
        responseData = { success: false, data: [] };
      }

      if (responseData.success) {
        setData(responseData.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setData([]);
    }
  };


  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const deleteWishlistProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteWishlistProduct.url, {
      method: SummaryApi.deleteWishlistProduct.method,
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData();
      context.fetchUserWishlistCount();
    }
  };

  const handleAddToCart = async (productId) => {
    const responseData = await addToCart(null, productId);
    if (responseData.success) {
      context.fetchUserAddToCart(); // update cart count
    }
  };

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Products in Wishlist</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:justify-between p-4">
        {/*** view wishlist products ***/}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingWishlist.map((el, index) => (
                <div
                  key={index + "wishlistLoading"}
                  className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                ></div>
              ))
            : data.map((product, index) => (
                <div
                  key={product?._id + "wishlist"}
                  className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
                >
                  <div className="w-32 h-32 bg-slate-200">
                    <img
                      src={product?.productId?.productImage[0]}
                      className="w-full h-full object-scale-down mix-blend-multiply"
                    />
                  </div>
                  <div className="px-4 py-2 relative">
                    {/** delete product */}
                    <div
                      className="absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                      onClick={() => deleteWishlistProduct(product?._id)}
                    >
                      <MdDelete />
                    </div>

                    <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                      {product?.productId?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {product?.productId?.category}
                    </p>
                    <p className="text-red-600 font-medium text-lg mt-1">
                      {displayINRCurrency(product?.productId?.sellingPrice)}
                    </p>

                    <button
                      className="mt-2 px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleAddToCart(product?.productId?._id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
