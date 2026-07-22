import Review from "../models/Review.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

const recalculateBookRating = async (bookId) => {
  const stats = await Review.aggregate([
    { $match: { book: new mongoose.Types.ObjectId(bookId) } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const averageRating = stats.length > 0 ? stats[0].averageRating : 0;

  await Book.findByIdAndUpdate(bookId, {
    rating: Math.round(averageRating * 10) / 10, 
  });
};

export const createReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "الكتاب غير موجود",
      });
    }

    const existing = await Review.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "لقد قمت بتقييم هذا الكتاب من قبل، يمكنك تعديل تقييمك",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment,
    });

    await recalculateBookRating(bookId);

    res.status(201).json({
      success: true,
      message: "تم إضافة التقييم بنجاح",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;

    const reviews = await Review.find({ book: bookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "التقييم غير موجود",
      });
    }

    if (req.body.rating !== undefined) {
      review.rating = req.body.rating;
    }

    if (req.body.comment !== undefined) {
      review.comment = req.body.comment;
    }

    await review.save();

    await recalculateBookRating(review.book);

    res.json({
      success: true,
      message: "تم تحديث التقييم",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "التقييم غير موجود",
      });
    }

    const bookId = review.book;

    await review.deleteOne();

    await recalculateBookRating(bookId);

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