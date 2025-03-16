import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 60 * 60 * 24 * 7);
};

const setCookies = (res, refreshToken, accessToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevents Xss attacks, crose-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 Min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents Xss attacks, crose-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Prevents CSRF attacks, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: "User already exists." });
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, refreshToken, accessToken);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error while creating user!", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (await user.comparePassword(password)) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      setCookies(res, refreshToken, accessToken);
      await storeRefreshToken(user._id, refreshToken);

      await redis.del(`refresh_token:${user._id}`);

      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      return res.status(401).json({ message: "Password does not match." });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, error });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = res.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({ message: "logged out successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, error });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found." });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents Xss attacks, crose-site scripting attack
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Prevents CSRF attacks, cross-site request forgery attack
      maxAge: 15 * 60 * 1000, // 15 Min
    });

    return res.status(201).json({ message: "Token refreshed successfully." });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, error });
  }
};

// TODO: implement get Profile
export const getProfile = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
};
