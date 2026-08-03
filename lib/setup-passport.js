const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../models/pool");
const bcrypt = require("bcryptjs");
const { getUser } = require("../models/users");

function setup_passport() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const res = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
          ]);
          const user = res.rows[0];

          if (!user) {
            return done(null, false, {
              message: "Incorrect email or it doesn't exist",
            });
          }

          const matched = await bcrypt.compare(password, user.password);
          if (!matched) {
            return done(null, false, { message: "Incorrect password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUser(id);

      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = { setup_passport };
