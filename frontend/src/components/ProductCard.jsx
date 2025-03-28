import { ShoppingCart } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    } else {
      // add to cart
      addToCart(product);
    }
  };

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg">
      <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
        <img
          className="w-full object-cover"
          src={product.image}
          alt="product image"
        />
        {/* <div className="bg-opacity-20 absolute inset-0 bg-black" /> */}
      </div>

      <div className="mt-4 px-5 pb-5">
        <h5 className="mb-2 line-clamp-3 text-xl font-semibold tracking-tight text-white">
          {product?.name}
        </h5>

        <h5 className="line-clamp-2 tracking-tight text-white">
          {product?.description}
        </h5>

        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">
              ${product?.price}
            </span>
          </p>
        </div>

        <button
          className="flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 focus:outline-none"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={22} className="mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
