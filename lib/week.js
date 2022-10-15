const Day = require("./day");
const nextId = require("./next-id");

class Week {
  static DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  static DAY_IDS = [1, 2, 3, 4, 5, 6, 7]; 

  constructor() {
    this.id = nextId();
    this.days = this._createWeek();
  }

  _createWeek() {
    let week = [];

    for (let index = 0; index < 7; index += 1) {
      let day = new Day(Week.DAY_NAMES[index], Week.DAY_IDS[index]);
      week.push(day);
    }
    return week;
  }

  getDay(name) {
    return this.days.find(day => day.name === name);
  } 

  addEmployeeToShift(day, shiftTime, employee) {
    let shiftDay = this.getDay(day);
    let employeeId = employee.getId();

    shiftDay.addToShift(shiftTime, employeeId);
  }

  removeEmployeeFromShift(day, shiftTime, employee) {
    let shiftDay = this.getDay(day);
    let employeeId = employee.getId();

    shiftDay.removeShift(shiftTime, employeeId);
  }

  getEmployeeShifts(employee) {
    let employeeId = employee.getId();
    let employeeShifts = [];

    this.days.forEach(day => {
      let shifts = day.findShift(employeeId);
      if (shifts.length > 0) {
        if(shifts.length > 1) {
          shifts.forEach(element => employeeShifts.push([day.name, element]));
        } else {
          employeeShifts.push([day.name, shifts[0]]);
        }
      }
    });

    return employeeShifts;
  }

}

module.exports = Week;