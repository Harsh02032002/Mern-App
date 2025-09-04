const wishListModel = require("../../models/wishList");

const deleteWishlist = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const wishlistId = req.body._id;

    const deleteProduct = await wishListModel.deleteOne({
      _id: wishlistId,
      userId: currentUserId,
    });

    res.json({
      message: "Removed from wishlist",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteWishlist;
