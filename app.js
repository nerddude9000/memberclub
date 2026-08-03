const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);
const passport = require("passport");
const { setup_passport } = require("./lib/setup-passport");
const pool = require("./models/pool");

const app = express();

require("process").loadEnvFile(path.join(__dirname, ".env"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

setup_passport();

app.use(
  expressSession({
    store: new pgSession({ pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./controller/index"));
app.use("/", require("./controller/auth"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log("Membership club started on port " + PORT);
});
