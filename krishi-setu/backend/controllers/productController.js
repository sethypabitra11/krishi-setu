const Product = require("../models/Product");

const getMarketPrice = (category, name) => {
  const prices = {
    vegetables: {
      tomato: 28,
      onion: 32,
      potato: 24,
      cabbage: 26,
      cauliflower: 35,
    },

    fruits: {
      apple: 120,
      banana: 45,
      mango: 80,
      orange: 70,
    },

    grains: {
      rice: 42,
      wheat: 30,
      maize: 25,
    },

    pulses: {
      lentil: 95,
      chickpea: 75,
      pigeonpea: 110,
    },
  };

  return prices[category?.toLowerCase()]?.[name?.toLowerCase()] || 30;
};

const addProduct = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;

    if (!name || !category || !quantity || !unit) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const product = await Product.create({
      farmer: req.user.id,
      name,
      category,
      quantity,
      unit,
      price: getMarketPrice(category, name),
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      farmer: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      available: true,
      quantity: { $gt: 0 },
    })
      .populate("farmer", "name")
      .sort({ createdAt: -1 });

    res.json({
      products,
    });
  } catch (error) {
    console.error("Get consumer products error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addProduct,
  getMyProducts,
  deleteProduct,
  getProducts,
};