const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema(
  {
    productId: {
      ref: "product",
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const wishlistModel = mongoose.model("wishlist", wishlistSchema);

module.exports = wishlistModel;
