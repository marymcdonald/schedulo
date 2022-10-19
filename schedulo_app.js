const express = require("express");
const morgan = require("morgan");
const { body, validationResult } = require("express-validator");
//let {employees, weeks} = require("./lib/seed-data");
const Schedulo = require("./lib/schedulo");
const session = require("express-session");
const store = require("connect-loki");
const flash = require("express-flash");

const app = express();
const LokiStore = store(session);

//const schedule = new Schedulo(employees, weeks);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(morgan("common"));12

app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000, // 31 days in milliseconds
    path: "/",
    secure: false,
  },
  name: "launch-school-schedulo-app-session-id",
  resave: false,
  saveUninitialized: true,
  secret: "this is not very secure",
  store: new LokiStore({}),
}));

app.use(flash());

app.use((req, res, next) => {
  if ("schedule" in req.session) {
    let schedule = Schedulo.makeSchedule(req.session.schedule);
    req.session.schedule = schedule;
  } else {
    req.session.schedule = new Schedulo();
  }
  next()
});

app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
})

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("schedulo-main");
})

app.get("/employees", (req, res) => {
  let schedule = req.session.schedule;

  res.render("employees", {
    employees: schedule.getAllEmployees(),
  });
});

app.get("/employees/new", (req, res) => {
  res.render("new-employee");
});

app.get("/schedule", (req, res) => {
  let schedule = req.session.schedule;
  let allShifts = schedule.getAllShifts();

  res.render("schedule", {
    currentWeek: allShifts[0],
    nextWeek: allShifts[1]
  });
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
      errors.array().map(error => req.flash("error", error.msg));

      res.render("new-employee", {
        flash: req.flash(),
        employeeName: req.body.name,
      })
    } else {
      next();
    }
  },
  (req, res) => {
    req.session.schedule.addEmployee(req.body.name);
    res.flash("success", "New employee added.");
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