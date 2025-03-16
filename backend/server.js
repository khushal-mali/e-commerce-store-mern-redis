import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

// route imports
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

// DB import
import { connectDB } from "./lib/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json()); // Allows you to parse body of the request
app.use(cookieParser());

// manage routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`server running on server http://localhost:${PORT}`);
  connectDB();
});
