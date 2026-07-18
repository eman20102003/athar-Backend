import User from "../models/User.js";
import Favorite from "../models/Favorite.js";
import ReadingProgress from "../models/ReadingProgress.js";
import Book from "../models/Book.js";


export const getPurchasedBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "purchasedBooks",
      populate: { path: "category", select: "name" },
    });

    res.json({
      success: true,
      count: user.purchasedBooks.length,
      books: user.purchasedBooks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const toggleFavorite = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    const existing = await Favorite.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existing) {
      await existing.deleteOne();

      return res.json({
        success: true,
        message: "تم إزالة الكتاب من المفضلة",
        isFavorite: false,
      });
    }

    await Favorite.create({
      user: req.user._id,
      book: bookId,
    });

    res.json({
      success: true,
      message: "تم إضافة الكتاب للمفضلة",
      isFavorite: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: "book",
        populate: { path: "category", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateReadingProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { currentPage } = req.body;

    if (!currentPage) {
      return res.status(400).json({
        success: false,
        message: "رقم الصفحة الحالية مطلوب",
      });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    const percentage = Math.min(
      100,
      Math.round((currentPage / book.pages) * 100)
    );

    const alreadyStarted = await ReadingProgress.findOne({ user: req.user._id, book: bookId });
    if (!alreadyStarted) {
      await Book.findByIdAndUpdate(bookId, { $inc: { readsCount: 1 } });
      }

    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, book: bookId },
      {
        currentPage,
        percentage,
        lastReadAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getContinueReading = async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user._id })
      .populate("book", "title coverImage pages")
      .sort({ lastReadAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};