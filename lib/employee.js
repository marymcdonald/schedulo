const nextId = require("./next-id");

module.exports = class Employee {
  constructor(name) {
    this.id = nextId();
    this.name = name;
    this.noScheduling = {};
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  static makeEmployee(rawEmployee) {
    return Object.assign(new Employee(), rawEmployee);
  }
};
