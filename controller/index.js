const express = require("express");

const router = express.Router();

router.get("/", (_, res) => {
  res.render("index");
});

router.get("/signup", (_, res) => {
  res.render("signup");
});

router.get("/login", (_, res) => {
  res.render("login");
});

module.exports = router;
