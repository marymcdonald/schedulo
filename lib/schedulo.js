//let {employees, weeks} = require("./seed-data");
const Employee = require("./employee");
const Week = require("./week");

class Schedulo {
  constructor() {
    // if (arguments.length === 0) {
    this.weeks = [new Week(), new Week()];
    this.employees = [];
    // } else {
    //   this.weeks = weeks;
    //   this.employees = employees;
    // }

  }

  getAllEmployees() {
    return this.employees;
  }

  getEmployeeName(employeeId) {
    for(const employee of this.employees) {
      if (employee.id === employeeId) {
        return employee.name;
      }
    }
    return null;
  }

  addEmployee(input) {
    if (input instanceof Employee) {
      this.employees.push(input)
    } else {    
      let newEmployee = new Employee(input);
      this.employees.push(newEmployee);
    }

  }

  removeEmployee(employeeId) {
    let index = this.employees.findIndex(employee => employee.id === employeeId);

    //remove employee's shifts
    this._removeEmployeeAllShifts(this.employees[index]);

    this.employees.splice(index, 1);
  }

  _removeEmployeeAllShifts(employee) {

    this.weeks.forEach(week => {

      let shifts = week.getEmployeeShifts(String(employee.id));

      //delete all of their shifts
      shifts.forEach(shift => week.removeEmployeeFromShift(shift[0], shift[1], employee));



    })
  }

  addEmployeeToShift(employeeId, weekId, dayId, shiftTime) {
    let index = this.weeks.findIndex(week => week.id === Number(weekId));

    this.weeks[index].addEmployeeToShift(dayId, shiftTime, employeeId);
  }

  removeEmployeeFromShift(employeeId, weekId, dayId, shiftTime) {
    let index = this.weeks.findIndex(week => week.id === Number(weekId));
    console.log(weekId);

    this.weeks[index].removeEmployeeFromShift(dayId, shiftTime, employeeId);
  }

  displayEmployeeList() {
    console.log(`ID | Name  | Do not schedule`);
    console.log('-'.repeat(30));
    this.employees.forEach(employee => {
      let noScheduled = employee.noScheduling ? 'None' : employee.noScheduling;
      console.log(` ${employee.id} | ${employee.name}  | ${noScheduled}`);
    })

  }

  getAllShifts() {
    return this.weeks;
  }

  displayShifts() {
    // console.log(this.weeks[0]);

    for(let index = 0; index < this.weeks[0].days.length; index += 1) {
      console.log(this.weeks[0].days[index].name);
      console.log(this.weeks[0].days[index].shifts);
    }
  }

  displayEmployeeShifts(employee) {
    this.weeks.forEach(week => {
      console.log(`Week ${week.id}`);
      console.log(week.getEmployeeShifts(employee));
    });
  }

  static makeSchedule(rawSchedule) {
    let schedule = Object.assign(new Schedulo(), {
      weeks: [],
    });

    rawSchedule.weeks.forEach(week => schedule.weeks.push(Week.makeWeek(week)));
    rawSchedule.employees.forEach(employee => schedule.addEmployee(Employee.makeEmployee(employee)));


    return schedule;
  }
}

// let schedulor = new Schedulo();
// console.log(schedulor);
// schedulor.displayEmployeeList();
// schedulor.displayShifts();

module.exports = Schedulo;

// let vincent = schedulor.getEmployee('Vincent');
// let ralph = schedulor.getEmployee('Ralph');


// schedulor.displayEmployeeShifts(ralph);
// schedulor.displayEmployeeShifts(vincent);

// let sandor = new Employee('Sandor');
// schedulor.addEmployeeToRoster(sandor);
// schedulor.displayEmployeeList();



