import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided." });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Unauthorized - User not found." });
      }
      req.user = user;

      next();
    } catch (error) {
      if (error === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access Token expired." });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.log(`[fileName: 'auth.middleware', Line Number: '31']`, error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only." });
  }
};
