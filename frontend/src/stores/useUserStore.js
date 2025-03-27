import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signUp: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      set({ loading: false });
      return;
    }

    try {
      const { data } = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(data);
      set({ user: data.user, loading: false });
      toast.success(data.message);
      return data;
    } catch (error) {
      console.log(
        `[fileName: 'useUserStore', Line Number: '30']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });

    try {
      const { data } = await axios.post("/auth/login", { email, password });
      set({ user: data.user, loading: false });
      toast.success(data.message);
      return data;
    } catch (error) {
      console.log(
        `[fileName: 'useUserStore', Line Number: '48']`,
        error.message,
      );
      set({ loading: false });
      return toast.error(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(
        `[fileName: 'useUserStore', Line Number: '63']`,
        error.message,
      );
      return toast.error(error.response.data.message);
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const { data } = await axios.get("/auth/profile");
      set({ user: data.user, checkingAuth: false });
    } catch (error) {
      console.log(
        `[fileName: 'useUserStore', Line Number: '77']`,
        error.message,
      );
      set({ checkingAuth: false, user: null });
    }
  },
}));

// TODO: Implement the axios interceptors for refreshing the access token 15m
