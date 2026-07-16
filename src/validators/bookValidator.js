import { body } from "express-validator";

export const createBookValidator = [
  body("title").trim().notEmpty().withMessage("عنوان الكتاب مطلوب"),

  body("author").trim().notEmpty().withMessage("اسم المؤلف مطلوب"),

  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("الوصف يجب أن يكون 10 أحرف على الأقل"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("السعر يجب أن يكون رقمًا موجبًا"),

  body("category").notEmpty().withMessage("التصنيف مطلوب").isMongoId().withMessage("معرّف التصنيف غير صحيح"),

  body("pages")
    .notEmpty()
    .withMessage("عدد الصفحات مطلوب")
    .isInt({ min: 1 })
    .withMessage("عدد الصفحات يجب أن يكون رقمًا صحيحًا موجبًا"),
];

export const updateBookValidator = [
  body("title").optional().trim().notEmpty().withMessage("عنوان الكتاب لا يمكن أن يكون فارغًا"),

  body("price").optional().isFloat({ min: 0 }).withMessage("السعر يجب أن يكون رقمًا موجبًا"),

  body("category").optional().isMongoId().withMessage("معرّف التصنيف غير صحيح"),

  body("pages").optional().isInt({ min: 1 }).withMessage("عدد الصفحات يجب أن يكون رقمًا صحيحًا موجبًا"),
];