import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    return res.status(201).json(user.cartItems);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Error while adding product to cart" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    return res.status(201).json(user.cartItems);
  } catch (error) {
    console.log(`[fileName: 'cart.controller', Line Number: '36']`, error.message);
    return res
      .status(500)
      .json({ message: "Error while adding product to cart", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(201).json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      return res.status(200).json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log(`[fileName: 'cart.controller', Line Number: '62']`, error.message);
    return res.status(500).json({
      message: "Error while updating quantity of the product",
      error: error.message,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
      return { ...product.toJSON(), quantity: item.quantity };
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    console.log(`[fileName: 'cart.controller', Line Number: '87']`, error.message);
    return res.status(500).json({
      message: error.message || "Error while fetching cart products",
    });
  }
};
