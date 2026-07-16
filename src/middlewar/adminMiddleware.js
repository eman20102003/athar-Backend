const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "غير مصرح، هذا الإجراء للمشرفين فقط",
    });
  }
};

export default adminOnly;