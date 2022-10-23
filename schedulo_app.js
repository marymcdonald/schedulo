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
app.use(morgan("common"));

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
  res.render("home");
})

//list of all employees
app.get("/employees", (req, res) => {
  let schedule = req.session.schedule;
  let employeeList = schedule.getAllEmployees()

  res.render("employees", {
    employees: employeeList,
  });
});

app.get("/employees/new", (req, res) => {
  res.render("new-employee");
});

//view the schedule page
app.get("/schedule", (req, res) => {
  let schedule = req.session.schedule;
  let allShifts = schedule.getAllShifts();

  res.render("schedule", {
    currentWeek: allShifts[0],
    nextWeek: allShifts[1]
  });
})

app.get("/schedule/edit", (req, res) => {
  let schedule = req.session.schedule;
  let allShifts = schedule.getAllShifts();
  let employeeList = schedule.getAllEmployees();

  res.render("schedule-edit", {
    allShifts: allShifts,
    currentWeek: allShifts[0],
    nextWeek: allShifts[1],
    employeeList: employeeList
  })
})

//add an employee to a shift
app.post("/schedule", (req, res) => {
  let schedule = req.session.schedule;
  let {employeeId, weekId, dayId, shiftTime} = req.body;

  
  console.log(schedule);
  console.log(req.body);
  schedule.addEmployeeToShift(employeeId, weekId, dayId, shiftTime);

  req.flash("success", `${employeeId} added to ${weekId} shift: ${dayId}`);
  res.redirect("/schedule")
});

//show all shifts for an employee
 app.get("/schedule/:employeeId/shifts", (req, res) => {
  let employeeId = req.params.employeeId;
  let schedule = req.session.schedule;
  let allShifts = schedule.getAllShifts();

  let shifts = allShifts[0].getEmployeeShifts(employeeId);

  console.log('shifts');
  console.log(shifts);

  res.render("shifts", {
    employeeName: schedule.getEmployeeName(+employeeId),
    employeeId: employeeId,
    currentWeek: allShifts[0],
    nextWeek: allShifts[1],
  })
 });

 //remove employee from a shift
 app.post("/schedule/:employeeId/shifts", (req, res) => {
  let employeeId = req.params;
  let {weekId, dayId, shiftTime} = req.body;
  let schedule = req.session.schedule;
  let allShifts = schedule.getAllShifts();

  schedule.removeEmployeeFromShift(employeeId, weekId, dayId, shiftTime);

  res.render("shifts", {
    employeeName: schedule.getEmployeeName(+employeeId),
    employeeId: employeeId,
    currentWeek: allShifts[0],
    nextWeek: allShifts[1],
  })
 });

//delete an employee from the list
app.post("/employees/:employeeId/delete", (req, res) => {
  let employeeId = req.params.employeeId;
  let schedule = req.session.schedule;

  schedule.removeEmployee(+employeeId);

  req.flash("success", "Employee removed.");
  res.redirect("/employees");

})

//add a new employee
app.post("/employees", 
  [
    body("employeeName")
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
        employeeName: req.body.employeeName,
      })
    } else {
      next();
    }
  },
  (req, res) => {
    let schedule = req.session.schedule;
    schedule.addEmployee(req.body.employeeName);
    req.flash("success", "New employee added.");
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