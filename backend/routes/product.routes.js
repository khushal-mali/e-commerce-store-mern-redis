import express from "express";

const router = express.Router();

router.get("/", protectedRoute, adminRoute, getAllProducts);

export default router;
