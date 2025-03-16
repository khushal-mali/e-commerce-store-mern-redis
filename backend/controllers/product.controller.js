import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(201).json({ products });
  } catch (error) {
    console.log(error.message);
    
  }
};
