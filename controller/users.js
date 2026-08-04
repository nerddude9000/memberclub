const { validationResult } = require("express-validator");
const { validateAuth, validateUpgrade } = require("../lib/validators");
const userModel = require("../models/users.js");

const router = require("express").Router();

router.get("/upgrade", validateAuth, (req, res) => {
  if (req.user.membership === "member") {
    return res.redirect("/");
  }

  res.render("upgrade");
});

router.post("/upgrade", validateAuth, validateUpgrade, async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).render("upgrade", {
      errors: result.array(),
    });
  }

  await userModel.upgradeUser(req.user.id);

  res.redirect("/");
});

module.exports = router;
