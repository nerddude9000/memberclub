const { validationResult, matchedData } = require("express-validator");
const { validateAuth, validateMessage } = require("../lib/validators");
const {
  createMessage,
  getOneMessage,
  getOneMessageWithAuthor,
  getAllMessagesWithAuthor,
  getAllMessages,
} = require("../models/messages");

const router = require("express").Router();

router.get("/", validateAuth, async (req, res) => {
  const messages =
    req.user.membership === "member"
      ? await getAllMessagesWithAuthor()
      : await getAllMessages();

  res.render("view-messages", { messages });
});

router.get("/:id", validateAuth, async (req, res) => {
  const id = req.params.id;
  const message =
    req.user.membership === "member"
      ? await getOneMessageWithAuthor(id)
      : await getOneMessage(id);

  res.render("view-single-message", { message });
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
