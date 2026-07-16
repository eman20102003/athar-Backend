import { body } from "express-validator";

export const reviewValidator = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("التقييم يجب أن يكون رقمًا من 1 إلى 5"),

  body("comment").optional().trim().isLength({ max: 500 }).withMessage("التعليق طويل جدًا"),
];