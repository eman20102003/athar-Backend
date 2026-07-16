import express from "express";
import { addBookmark, getBookmarks, deleteBookmark } from "../controllers/bookmarkController.js";
import protect from "../middleware/authMiddleware.js";
import { bookmarkValidator } from "../validators/readerValidator.js";
import handleValidation from "../validators/handleValidation.js";

const router = express.Router();

router.post("/", protect, bookmarkValidator, handleValidation, addBookmark);
router.get("/:bookId", protect, getBookmarks);
router.delete("/:id", protect, deleteBookmark);

export default router;