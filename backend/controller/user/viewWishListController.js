const wishlistModel = require("../../models/wishList");

const viewWishlistController = async (req, res) => {
  try {
    const currentUser = req.userId;

    const allProducts = await wishlistModel
      .find({
        userId: currentUser,
      })
      .populate("productId"); // product details laane ke liye

    res.json({
      data: allProducts,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = viewWishlistController;
