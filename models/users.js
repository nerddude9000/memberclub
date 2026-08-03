const pool = require("./pool");

async function getUser(id) {
  const res = await pool.query(
    `SELECT id, firstname, lastname, email, membership 
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

async function upgradeUser(id) {
  await pool.query(
    `UPDATE users
		SET membership = 'member'
		WHERE id = $1`,
    [id],
  );
}

module.exports = { createUser, getUser, upgradeUser };
