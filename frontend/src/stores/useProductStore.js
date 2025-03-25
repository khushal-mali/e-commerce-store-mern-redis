import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const { data } = await axios.post("/products", productData);

      set((prevState) => ({
        products: [...prevState.products, data.product],
        loading: false,
      }));
      toast.success(data.message);
      return data;
    } catch (error) {
      console.log(
        `[fileName: 'useProductStore', Line Number: '25']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });

    try {
      const { data } = await axios.get("/products");
      set({ products: data.products, loading: false });
    } catch (error) {
      console.log(
        `[fileName: 'useProductStore', Line Number: '40']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(
        error.response.data.message || "Failed to fetch products.",
      );
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });

    try {
      const { data } = await axios.delete(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.filter(
          (product) => product._id !== productId,
        ),
        loading: false,
      }));
      toast.success(data.message);
    } catch (error) {
      console.log(
        `[fileName: 'useProductStore', Line Number: '62']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });

    try {
      const { data } = await axios.patch(`/products/${productId}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: data.product.isFeatured }
            : product,
        ),
        loading: false,
      }));
      toast.success(data.message);
    } catch (error) {
      console.log(
        `[fileName: 'useProductStore', Line Number: '88']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(error.response.data.message || "Failed to toggle.");
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });

    try {
      const { data } = await axios.get(`/products/category/${category}`);
      set({ products: data.products, loading: false });
    } catch (error) {
      console.log(
        `[fileName: 'useProductStore', Line Number: '104']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(
        error.response.data.message || "Failed to fetch products.",
      );
    }
  },
}));
