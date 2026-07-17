import express from "express";
import { createNote, getNotes, updateNote, deleteNote } from "../controllers/noteController.js";
import protect from "../middleware/authMiddleware.js";
import { noteValidator } from "../validators/readerValidator.js";
import checkOwnership from "../middleware/checkOwnership.js";
import handleValidation from "../validators/handleValidation.js";

const router = express.Router();

router.post("/", protect, noteValidator, handleValidation,checkOwnership, createNote);
router.get("/:bookId", protect,checkOwnership, getNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

export default router;