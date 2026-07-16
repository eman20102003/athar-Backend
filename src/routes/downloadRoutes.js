import express from "express";
import { downloadBook, streamBookPdf } from "../controllers/downloadController.js";
import protect from "../middleware/authMiddleware.js";
import checkOwnership from "../middleware/checkOwnership.js";

const router = express.Router();

router.get("/:bookId/download", protect, checkOwnership, downloadBook);
router.get("/:bookId/read", protect, checkOwnership, streamBookPdf);

export default router;