
const Employee = require("./employee");
const Week = require("./week");

let mary = new Employee("Mary");
let vincent = new Employee("Vincent");
let ralph = new Employee("Ralph");
let naomi = new Employee("Naomi");
let siobahn = new Employee("Siobahn");

let week1 = new Week();
let week2 = new Week();

week1.addEmployeeToShift('Monday', 'midMorning', mary);
week1.addEmployeeToShift('Tuesday', 'midMorning', mary);
week1.addEmployeeToShift('Wednesday', 'midMorning', mary);
week1.addEmployeeToShift('Thursday', 'Afternoon', mary);

week1.addEmployeeToShift('Monday', 'Afternoon', vincent);
week1.addEmployeeToShift('Thursday', 'Afternoon', vincent);
week1.addEmployeeToShift('Friday', 'Morning', vincent);

week1.addEmployeeToShift('Saturday', 'Morning', ralph);
week1.addEmployeeToShift('Saturday', 'Afternoon', ralph);
week2.addEmployeeToShift('Tuesday', 'Morning', ralph);

week2.addEmployeeToShift('Wednesday', 'midMorning', naomi);
week2.addEmployeeToShift('Friday', 'Afternoon', siobahn);

week1.removeEmployeeFromShift('Thursday', 'Afternoon', mary);

let employees = [mary, vincent, ralph, naomi, siobahn];
let weeks = [week1, week2];

module.exports = {employees, weeks};