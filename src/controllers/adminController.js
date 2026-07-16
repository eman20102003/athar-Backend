import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";
import Review from "../models/Review.js";

// أرقام سريعة بس (بدون رسوم بيانية) للكروت اللي فوق الداشبورد
export const getDashboardSummary = async (req, res) => {
  try {
    const [usersCount, booksCount, ordersCount, categoriesCount] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Order.countDocuments({ status: "paid" }),
      Category.countDocuments(),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      summary: {
        usersCount,
        booksCount,
        ordersCount,
        categoriesCount,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- Users Management ----------

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "الصلاحية غير صحيحة",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "تم تحديث صلاحية المستخدم",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "المستخدم غير موجود",
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "لا يمكنك حذف حسابك الخاص",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "تم حذف المستخدم",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- Orders Management ----------

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("book", "title price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ---------- Reviews Management (حذف تعليق غير لائق مثلاً) ----------

export const deleteReviewAsAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "التقييم غير موجود",
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: "تم حذف التقييم",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};