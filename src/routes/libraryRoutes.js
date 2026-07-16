import express from "express";
import {
  getPurchasedBooks,
  toggleFavorite,
  getFavorites,
  updateReadingProgress,
  getContinueReading,
} from "../controllers/libraryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/purchased", protect, getPurchasedBooks);
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:bookId", protect, toggleFavorite);
router.get("/continue-reading", protect, getContinueReading);
router.put("/progress/:bookId", protect, updateReadingProgress);

export default router;