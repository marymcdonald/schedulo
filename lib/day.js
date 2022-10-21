module.exports = class Day {
  constructor(name, id) {
    this.id = id;
    this.name = name;
    this.shifts = {
      Morning: [],
      midMorning: [],
      Afternoon: [],
    }
  }

  getId() {
    return this.id;
  }

  addToShift(shiftTime, employeeId) {
    this.shifts[shiftTime].push(employeeId);
  }

  findShift(employeeId) {
    let shifts = [];
    for (const shiftTime in this.shifts) {
      if (this.shifts[shiftTime].includes(employeeId)) {
        shifts.push(shiftTime);
      }
    }
    return shifts;
  }

  removeShift(shiftTime, employeeId) {
    let index = this.shifts[shiftTime].findIndex(element => element === employeeId);
    this.shifts[shiftTime].splice(index, 1);
  }

  displayShifts() {
    let name = `---- ${this.name} ----`;
    let list= [];
    for (let key in this.shifts) {
      list.push(this.shifts[key].join('\n'));
    }
    console.log(`${name}\n${list}`);
  }

  static makeDay(rawDay) {
    return Object.assign(new Day(), rawDay);
  }
};

