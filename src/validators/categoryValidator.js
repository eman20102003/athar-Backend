import { body } from "express-validator";

export const categoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("اسم التصنيف مطلوب")
    .isLength({ min: 2, max: 30 })
    .withMessage("اسم التصنيف يجب أن يكون بين 2 و 30 حرف"),
];