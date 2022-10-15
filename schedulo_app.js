const express = require("express");
const morgan = require("morgan");
const app = express();

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.render("schedulo-main");
});

app.listen(3000, "localhost", () => {
  console.log("Listening to post 3000");
});