const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    res.json({
      items: cart.items,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.json({
      message: "Item added to cart",
      items: cart.items,
    });
  } catch (error) {
    console.error("Add cart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        message: "Product ID and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart",
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (cartItem) =>
          cartItem.product.toString() !== productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({
      message: "Cart updated",
      items: cart.items,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({
      message: "Item removed from cart",
      items: cart.items,
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        items: [],
      },
      {
        upsert: true,
      }
    );

    res.json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};