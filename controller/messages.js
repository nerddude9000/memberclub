const { validationResult, matchedData } = require("express-validator");
const { validateAuth, validateMessage } = require("../lib/validators");
const {
  createMessage,
  getAllMessagesWithAuthor,
  getAllMessages,
} = require("../models/messages");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const messages =
    req.user && req.user.membership === "member"
      ? await getAllMessagesWithAuthor()
      : await getAllMessages();

  res.render("view-messages", { messages });
});

router.get("/create", validateAuth, (_, res) => {
  res.render("create-message");
});

router.post("/create", validateAuth, validateMessage, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("create-message", {
      errors: errors.array(),
    });
  }

  const { title, content } = matchedData(req);
  const user_id = req.user.id;

  await createMessage(user_id, title, content);

  res.redirect(req.baseUrl);
});

module.exports = router;
