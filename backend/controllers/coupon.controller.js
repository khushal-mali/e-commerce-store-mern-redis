import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

    return res.status(200).json(coupon || null);
  } catch (error) {
    console.log(`[fileName: 'coupon.controller', Line Number: '9']`, error.message);
    return res.status(500).json({
      message: "Unable to get Coupon for user",
      error: error.message,
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code, userId: req.user._id, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found!" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(401).json({ message: "Coupon is Expired!" });
    }

    return res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log(`[fileName: 'coupon.controller', Line Number: '38']`, error.message);
    return res.status(500).json({
      message: "Unable to validate coupon",
      error: error.message,
    });
  }
};
