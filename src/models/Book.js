import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    language: {
      type: String,
      default: "العربية",
    },

    pages: {
      type: Number,
      required: true,
    },

    coverImage: {
      type: String, // path or URL
      required: true,
    },

    pdfFile: {
      type: String, // path or URL
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
   isFeatured: {
     type: Boolean,
     default: false,
    },

   readsCount: {
    type: Number,
    default: 0,
  },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);