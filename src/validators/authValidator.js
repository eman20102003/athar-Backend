import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("الاسم يجب أن يكون بين 3 و 50 حرف"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("البريد الإلكتروني غير صحيح")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("البريد الإلكتروني غير صحيح"),

  body("password").notEmpty().withMessage("كلمة المرور مطلوبة"),
];

export const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("الاسم يجب أن يكون بين 3 و 50 حرف"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("البريد الإلكتروني غير صحيح")
    .normalizeEmail(),
];