const express = require("express");
const morgan = require("morgan");
let {employees, weeks} = require("./lib/seed-data");
const Schedulo = require("./lib/schedulo");
const app = express();

const schedule = new Schedulo(employees, weeks);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("schedulo-main");
})

app.get("/employees", (req, res) => {
  res.render("employees", {
    employees: schedule.getAllEmployees(),
  });
});

app.listen(3000, "localhost", () => {
  console.log("Listening to post 3000");
});