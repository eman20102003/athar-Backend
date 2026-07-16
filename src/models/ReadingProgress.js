import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    currentPage: {
      type: Number,
      default: 1,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model("ReadingProgress", readingProgressSchema);