const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users.js");
const router = require("express").Router();

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

router.post("/signup", validateSignup, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).render("signup", {
      errors: result.array(),
    });
  }

  const { firstname, lastname, email, password } = matchedData(req);

  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  res.redirect("/");
});

module.exports = router;
