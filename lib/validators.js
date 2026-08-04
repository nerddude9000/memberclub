const { body } = require("express-validator");

const validateAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  res.locals.user = req.user;
  next();
};

const validateSignup = [
  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("Invalid first name")
    .isLength({ min: 2, max: 64 })
    .withMessage("First name must be between 8 and 64 characters"),
  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Invalid last name")
    .isLength({ min: 2, max: 64 })
    .withMessage("Last name must be between 8 and 64 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters"),
  body("password2")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

const validateUpgrade = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .custom((value) => value === process.env.JOIN_CLUB_CODE)
    .withMessage("That is not the right code."),
];

const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 4, max: 96 })
    .withMessage("Title must be between 4 and 96 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4, max: 1024 })
    .withMessage("Content must be between 4 and 1024 characters"),
];

module.exports = {
  validateSignup,
  validateUpgrade,
  validateAuth,
  validateMessage,
};
