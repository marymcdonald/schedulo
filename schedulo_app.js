const express = require("express");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
let {employees, weeks} = require("./lib/seed-data");
const Schedulo = require("./lib/schedulo");
const app = express();

const schedule = new Schedulo(employees, weeks);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.redirect("/schedule");
});

app.get("/home", (req, res) => {
  res.render("schedulo-main");
})

app.get("/employees", (req, res) => {
  res.render("employees", {
    employees: schedule.getAllEmployees(),
  });
});

app.get("/employees/new", (req, res) => {
  res.render("new-employee");
});

app.get("/schedule", (req, res) => {
  let scheduled = schedule.getAllShifts();
  res.render("schedule", {
    currentWeek: scheduled[0],
    nextWeek: scheduled[1]
  })
})

app.post("/employees", 
  [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Name is required.")
      .bail()
      .isLength({ max: 25 })
      .withMessage("Name is too long. Max length 25 characters.")
      .isAlpha()
      .withMessage("Name has invalid chars. Alphabetical characters only.")
  ],
  (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.render("new-employee", {
        errorMessages: errors.array().map(error => error.msg),
        employeeName: req.body.name,
      })
    } else {
      next();
    }
  },
  (req, res, next) => {
    schedule.addEmployeeToRoster(req.body.name);

    res.redirect("/employees")
  }
);

//Error handler
app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

//Listener
app.listen(3000, "localhost", () => {
  console.log("Listening to post 3000");
});