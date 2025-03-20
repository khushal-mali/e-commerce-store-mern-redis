import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  signUp,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", protectedRoute, getProfile);

export default router;
