const pool = require("./pool");

async function getAllMessages() {
  const res = await pool.query(
    "SELECT id, title, content, created_at FROM messages",
  );

  return res.rows;
}

async function getAllMessagesWithAuthor() {
  const res = await pool.query(
    `SELECT m.id, m.title, m.content, m.created_at, u.firstname, u.lastname
		FROM messages as m
		JOIN users as u
		ON m.user_id = u.id`,
  );

  return res.rows;
}

async function getOneMessage(id) {
  const res = await pool.query(
    "SELECT id, title, content, created_at FROM messages WHERE id = $1",
    [id],
  );

  return res.rows[0];
}

async function getOneMessageWithAuthor(id) {
  const res = await pool.query(
    `SELECT m.id, m.title, m.content, m.created_at, u.firstname, u.lastname
		FROM messages as m
		WHERE m.id = $1
		JOIN users as u
		ON m.user_id = u.id`,
    [id],
  );

  return res.rows[0];
}

async function createMessage(user_id, title, content) {
  await pool.query(
    `INSERT INTO messages (user_id, title, content)
		VALUES ($1, $2, $3)`,
    [user_id, title, content],
  );
}

module.exports = {
  getAllMessages,
  getOneMessageWithAuthor,
  getOneMessage,
  getOneMessageWithAuthor,
  createMessage,
};
