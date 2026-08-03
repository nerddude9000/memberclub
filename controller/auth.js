const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users.js");
const passport = require("passport");
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

const validateUpgrade = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .custom((value) => value === process.env.JOIN_CLUB_CODE)
    .withMessage("That is not the right code."),
];

const validateAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  next();
};

router.get("/signup", (_, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login", {
    errorMessages: req.session.messages,
  });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

router.get("/upgrade", (_, res) => {
  res.render("upgrade");
});

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

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

router.post("/upgrade", validateAuth, validateUpgrade, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).render("upgrade", {
      errors: result.array(),
    });
  }

  console.log(req.user);
  await userModel.upgradeUser(req.user.id);

  res.redirect("/");
});

module.exports = router;
