import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { categoryValidator } from "../validators/categoryValidator.js";
import handleValidation from "../validators/handleValidation.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly,categoryValidator, handleValidation,createCategory);
router.put("/:id", protect, adminOnly,categoryValidator, handleValidation,updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;