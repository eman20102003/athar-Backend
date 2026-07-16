import express from "express";
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

const bookUpload = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", protect, adminOnly, bookUpload, createBook);
router.put("/:id", protect, adminOnly, bookUpload, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;