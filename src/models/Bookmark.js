import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
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

    page: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// يمنع تكرار نفس الصفحة كـ bookmark لنفس الكتاب ونفس المستخدم
bookmarkSchema.index({ user: 1, book: 1, page: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);