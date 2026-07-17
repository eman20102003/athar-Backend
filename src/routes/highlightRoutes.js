import express from "express";
import { addHighlight, getHighlights, deleteHighlight } from "../controllers/highlightController.js";
import protect from "../middleware/authMiddleware.js";
import { highlightValidator } from "../validators/readerValidator.js";
import checkOwnership from "../middleware/checkOwnership.js";
import handleValidation from "../validators/handleValidation.js";

const router = express.Router();

router.post("/", protect, highlightValidator, handleValidation,checkOwnership, addHighlight);
router.get("/:bookId", protect,checkOwnership, getHighlights);
router.delete("/:id", protect, deleteHighlight);

export default router;