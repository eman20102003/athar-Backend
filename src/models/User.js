import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    purchasedBooks: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);