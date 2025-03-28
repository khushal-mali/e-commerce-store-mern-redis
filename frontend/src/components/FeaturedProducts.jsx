import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();
  console.log(currentIndex, itemsPerPage);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-5xl font-bold text-emerald-400 sm:text-6xl">
          Featured
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className="w-full flex-shrink-0 px-2 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                >
                  <div className="bg-opacity-10 h-full overflow-hidden rounded-lg border border-emerald-500/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-full object-fill transition-transform duration-300 ease-in-out hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-white">
                        {product.name}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-sm text-emerald-200">
                        {product?.description}
                      </p>
                      <p className="mb-4 font-medium text-emerald-300">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="mt-auto">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex w-full cursor-pointer items-center justify-center rounded bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-emerald-500"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isStartDisabled && (
            <button
              onClick={prevSlide}
              disabled={isStartDisabled}
              className={`absolute top-1/2 -left-4 -translate-y-1/2 transform rounded-full p-2 transition-colors duration-300 ${
                isStartDisabled
                  ? "cursor-not-allowed bg-slate-800"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {!isEndDisabled && (
            <button
              onClick={nextSlide}
              disabled={isEndDisabled}
              className={`absolute top-1/2 -right-4 -translate-y-1/2 transform rounded-full p-2 transition-colors duration-300 ${
                isEndDisabled
                  ? "cursor-not-allowed bg-slate-800"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default FeaturedProducts;
