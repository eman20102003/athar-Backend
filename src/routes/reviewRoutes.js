import express from "express";
import {
  createReview,
  getBookReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";
import { reviewValidator } from "../validators/reviewValidator.js";
import handleValidation from "../validators/handleValidation.js";

const router = express.Router();

router.post("/:bookId", protect, reviewValidator, handleValidation, createReview);
router.get("/:bookId", getBookReviews);
router.put("/:id", protect, reviewValidator, handleValidation, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;