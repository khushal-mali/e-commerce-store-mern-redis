import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  getCartItems: async () => {
    try {
      const { data } = await axios.get("/cart");
      set({ cart: data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      console.log(
        `[fileName: 'useCartStore', Line Number: '45']`,
        error.message,
      );
      return toast.error(
        error.response.data.message || "Failed to fetch cart items.",
      );
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      console.log(
        `[fileName: 'useCartStore', Line Number: '64']`,
        error.message,
      );
      toast.error(error.response.data.message || "An error");
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    }));
    get().calculateTotals();
  },

  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart/", { productId: product._id });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );

        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });

      get().calculateTotals();
      toast.success("Product added to cart");
    } catch (error) {
      console.log(`[fileName: 'useCartStore', Line Number: '112']`, error);
      return toast.error(
        error.response.data.message || "Failed to add product to cart.",
      );
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => (sum += item.price * item.quantity),
      0,
    );

    const total = coupon
      ? subTotal - subTotal * (coupon.discountPercentage / 100)
      : subTotal;

    set({ subTotal, total });
  },
}));
