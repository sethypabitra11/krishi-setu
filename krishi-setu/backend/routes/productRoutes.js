const express = require("express");

const {
  addProduct,
  getMyProducts,
  deleteProduct,
  getProducts,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/my-products", protect, getMyProducts);
router.delete("/:id", protect, deleteProduct);
router.get("/", protect, getProducts);

module.exports = router;