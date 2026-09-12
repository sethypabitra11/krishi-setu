const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.put("/", protect, updateCartItem);

router.delete("/:productId", protect, removeFromCart);

router.delete("/", protect, clearCart);

module.exports = router;