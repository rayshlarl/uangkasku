import { body, validationResult } from "express-validator";

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email Wajib diisi")
    .isEmail()
    .withMessage("Format email harus benar"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
