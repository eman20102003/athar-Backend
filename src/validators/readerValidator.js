import { body } from "express-validator";

export const bookmarkValidator = [
  body("bookId").isMongoId().withMessage("معرّف الكتاب غير صحيح"),
  body("page").isInt({ min: 1 }).withMessage("رقم الصفحة يجب أن يكون رقمًا صحيحًا موجبًا"),
  body("label").optional().trim(),
];

export const highlightValidator = [
  body("bookId").isMongoId().withMessage("معرّف الكتاب غير صحيح"),
  body("page").isInt({ min: 1 }).withMessage("رقم الصفحة يجب أن يكون رقمًا صحيحًا موجبًا"),
  body("text").trim().notEmpty().withMessage("نص التظليل مطلوب"),
];

export const noteValidator = [
  body("bookId").isMongoId().withMessage("معرّف الكتاب غير صحيح"),
  body("page").isInt({ min: 1 }).withMessage("رقم الصفحة يجب أن يكون رقمًا صحيحًا موجبًا"),
  body("content").trim().notEmpty().withMessage("محتوى الملاحظة مطلوب"),
];