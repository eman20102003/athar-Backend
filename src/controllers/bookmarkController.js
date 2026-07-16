import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (req, res) => {
  try {
    const { bookId, page, label } = req.body;

    const existing = await Bookmark.findOne({
      user: req.user._id,
      book: bookId,
      page,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "هذه الصفحة محفوظة بالفعل كإشارة مرجعية",
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      book: bookId,
      page,
      label,
    });

    res.status(201).json({
      success: true,
      message: "تم إضافة الإشارة المرجعية",
      bookmark,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const { bookId } = req.params;

    const bookmarks = await Bookmark.find({
      user: req.user._id,
      book: bookId,
    }).sort({ page: 1 });

    res.json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "الإشارة المرجعية غير موجودة",
      });
    }

    await bookmark.deleteOne();

    res.json({
      success: true,
      message: "تم حذف الإشارة المرجعية",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};