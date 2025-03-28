import React from "react";
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";
import { Star, Trash } from "lucide-react";
import Tooltip from "./ToolTip";

const ProductsList = () => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  console.log("products", products);

  return (
    <motion.div
      className="mx-auto max-w-4xl overflow-x-auto overflow-y-hidden rounded-lg bg-gray-800 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
            >
              Category
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-700 bg-gray-800">
          {products?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-wrap text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Tooltip text="Toggle Featured product">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`cursor-pointer rounded-full p-1 ${
                      product.isFeatured
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gray-600 text-gray-300"
                    } transition-colors duration-200 hover:bg-yellow-500`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                </Tooltip>
              </td>
              <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                <Tooltip text="Delete the product">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="cursor-pointer rounded-md border border-transparent p-2 text-red-400 hover:border-slate-800 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;
