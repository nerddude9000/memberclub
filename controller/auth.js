const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users.js");
const passport = require("passport");
const { validateSignup } = require("../lib/validators.js");
const router = require("express").Router();

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

router.post("/signup", validateSignup, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("signup", {
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

module.exports = router;
