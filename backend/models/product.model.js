import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required."] },
    description: { type: String, required: [true, "Description is required."] },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: [true, "Image is required."] },
    type: { type: String, required: [true, "Type is required."] },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
