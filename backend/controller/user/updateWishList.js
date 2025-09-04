const WishlistModel = require("../../models/wishList");

const updateWishlist = async (req, res) => {
  try {
    const wishlistId = req.body._id;
    const updateFields = req.body; // जो भी fields भेजे जाएँ, वो update होंगे

    const updatedItem = await WishlistModel.updateOne(
      { _id: wishlistId },
      { $set: updateFields }
    );

    res.json({
      message: "Wishlist item updated successfully",
      data: updatedItem,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

module.exports = updateWishlist;
