import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
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

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "usd",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },

    bookTitleSnapshot: {
      type: String,
     },

    bookCoverSnapshot: {
     type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);