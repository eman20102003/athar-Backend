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
import { createBookValidator, updateBookValidator } from "../validators/bookValidator.js";
import handleValidation from "../validators/handleValidation.js";


const router = express.Router();

const bookUpload = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", protect, adminOnly, bookUpload,createBookValidator, handleValidation, createBook);
router.put("/:id", protect, adminOnly, bookUpload, updateBookValidator, handleValidation,updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;