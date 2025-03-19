import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

    return res.status(200).json(coupon || null);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to get Coupon for user",
      error: error.message,
    });
  }
};
