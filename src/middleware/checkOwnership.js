import Book from "../models/Book.js";

const checkOwnership = async (req, res, next) => {
  try {
    const bookId = req.params.bookId || req.params.id || req.body.bookId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    // الكتاب المجاني: قراءة وتحميل مفتوحين للجميع
    if (book.isFree) {
      req.book = book;
      return next();
    }

    // الكتاب المدفوع: لازم يكون ضمن مكتبة المستخدم (اشتراه فعلاً)
    const owned = req.user.purchasedBooks.some(
      (id) => id.toString() === bookId
    );

    if (!owned) {
      return res.status(403).json({
        success: false,
        message: "يجب شراء الكتاب أولاً للوصول لهذا المحتوى",
      });
    }

    req.book = book;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default checkOwnership;