import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(201).json({ message: "Success", products });
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '10']`, error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(201).json(JSON.parse(featuredProducts));
    }

    // if not redis then fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found." });
    }

    // store in redis for future quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    return res.status(201).json(featuredProducts);
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '34']`, error.message);
    return res.status(500).json({ message: "Error fetching featured products.", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });

    return res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '60']`, error);
    return res.status(500).json({ message: "Error creating product.", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // This will get the id of the image

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Deleted image from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary.", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '85']`, error.message);
    return res.status(500).json({ message: "Error deleting product.", error });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
          category: 1,
        },
      },
    ]);

    return res.status(201).json(products);
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '110']`, error.message);
    return res
      .status(500)
      .json({ message: "Error while fetching recommended products.", error });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await Product.find({ category });
    return res.status(201).json({ message: "Success.", products });
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '123']`, error.message);
    return res
      .status(500)
      .json({ message: "Error while fetching products by category", error });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found." });
    }

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();

    await updateFeaturedProductsCache();
    return res.status(201).json({ message: "Product updated.", product: updatedProduct });
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '146']`, error.message);
    return res.status(500).json({ message: "Error toggling featured product.", error });
  }
};

export const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(`[fileName: 'product.controller', Line Number: '156']`, error.message);
    return res.status(500).json({ message: "Error toggling featured product.", error });
  }
};
