let {employees, weeks} = require("./lib/seed-data");
const Employee = require("./lib/employee");
const Week = require("./lib/week");

class Schedulo {
  constructor(employees, weeks) {
    this.weeks = weeks;
    this.employees = employees;
  }

  getEmployee(name) {
    for(const employee of this.employees) {
      if (employee.name === name) {
        return employee;
      }
    }
    return null;
  }

  addEmployeeToRoster(employee) {
    if(!(employee instanceof Employee)) {
      throw new TypeError("can only add Employee objects");
    }
    this.employees.push(employee);
  }

  removeEmployeeFromRoster(employeeName) {
    let index = this.employees.findIndex(employee => employee.name === employeeName);

    //remove employee's shifts
    this.removeEmployeeAllShifts(this.employees[index]);

    this.employees.splice(index, 1);
  }

  removeEmployeeAllShifts(employee) {
    this.weeks.forEach(week => {
      let shifts = week.getEmployeeShifts(employee);

      //delete all of their shifts
      shifts.forEach(shift => week.removeEmployeeFromShift(shift[0], shift[1], employee));
    })
  }

  displayEmployeeList() {
    console.log(`ID | Name  | Do not schedule`);
    console.log('-'.repeat(30));
    this.employees.forEach(employee => {
      let noScheduled = employee.noScheduling ? 'None' : employee.noScheduling;
      console.log(` ${employee.id} | ${employee.name}  | ${noScheduled}`);
    })

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

}

let schedulor = new Schedulo(employees, weeks);
schedulor.displayEmployeeList();
// schedulor.displayShifts();

// let vincent = schedulor.getEmployee('Vincent');
// let ralph = schedulor.getEmployee('Ralph');


// schedulor.displayEmployeeShifts(ralph);
// schedulor.displayEmployeeShifts(vincent);

// let sandor = new Employee('Sandor');
// schedulor.addEmployeeToRoster(sandor);
// schedulor.displayEmployeeList();



