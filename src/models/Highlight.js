import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
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

    text: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      default: "#FFEB3B",
    },

    position: {
      // إحداثيات التظليل على الصفحة (بتيجي من React PDF)
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Highlight", highlightSchema);