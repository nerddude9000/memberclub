const path = require("path");
const express = require("express");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", require("./controller/index"));
app.use("/", require("./controller/auth"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;

  console.log("Membership club started on port " + PORT);
});
