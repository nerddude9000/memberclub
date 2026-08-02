const pool = require("./pool");

async function getUser(id) {
  const res = await pool.query(
    `SELECT firstname, lastname, email, membership 
		FROM users WHERE id = $1`,
    [id],
  );

  return res.rows[0];
}

async function createUser({ firstname, lastname, email, password }) {
  await pool.query(
    `INSERT INTO users 
		(firstname, lastname, email, password) VALUES 
		($1, $2, $3, $4)`,
    [firstname, lastname, email, password],
  );
}

module.exports = { createUser, getUser };
