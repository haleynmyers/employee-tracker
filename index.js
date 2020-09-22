// * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

const { allowedNodeEnvironmentFlags } = require("process");
const { createBrotliDecompress } = require("zlib");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a new department, role, or employee",
        "View departments, roles, employees",
        "Update employee roles",
        "View employees by manager",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a new department, role, or employee":
          addContent();
          break;
        case "View departments, roles, employees":
          viewContent();
          break;
        case "Update employee roles":
          updateRoles();
          break;
        case "View employees by manager":
          viewByManager();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};

function addContent() {
  inquirer
    .prompt({
      name: "addSomething",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Roles", "Employees"]
    }).then(function (answer) {
      switch (answer.addSomething) {
        case "Department":
          addDepartment();
          break;
        case "Roles":
          addRole();
          break;
        case "Employees":
          addEmployee();
          break;
      }
    });
}

//called in addContent function if selected dept
function addDepartment() {
  inquirer
    .prompt({
      name: "addDept",
      type: "input",
      message: "What is the name of the new department?"
    }).then(function (answer) {
      var query = `INSERT INTO department VALUE name = ?`;
      connection.query(query, answer.addDept, function (err, res) {
        if (err) throw err;
        console.log("A new department named " + answer.addDept + " has been added!\n");
        start();
      })
    })
};

//called in addContent function if selected role
function addRole() {
  //grabs all the dept names and ids so we can assign dept_id later
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    //asking for the three properties on the roles table      
    inquirer.prompt(
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?"
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary of this position?",
      },
      {
        name: "deptId",
        type: "rawlist",
        choices: res,
        message: "What department is this role in?"
      })
      //Inserting new role properties to the table
      .then(function (answer) {
        const selectedDept = res.find(item => answer.deptID === item.id);
        createNewRole(selectedDept.id);
      })
  })
};

function createNewRole(id) {
  var query = `INSERT INTO roles VALUES title = ? salary = ? dept_id = ?`;
  connection.query(query, [answer.title, answer.salary, res.departments.id], function (err, res) {
    if (err) throw err;
    console.log("A new role has been added. \nTitle: " + answer.title + "\nSalary: " + answer.salary);
    start();
  })
};

function addEmployee() {
  //query list of roles to access in inquirer q3
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    inquirer.prompt(
      {
        name: "firstName",
        type: "input",
        message: "What is the new employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the new employee's last name?"
      },
      {
        name: "roleId",
        type: "rawlist",
        choices: res,
        message: "Select a role for the employee"
      })
      .then(function (answer) {
        const selectedRole = res.find(item => answer.role === item.name);
        console.log(selectedRole.id);
        createNewEmployee(id);
      })
    })
};

function createNewEmployee(id){
  var query = `INSERT INTO employee VALUES firstName = ? lastName = ? role_id = ?`;
  connection.query(query, [answer.firstName, answer.lastName, selectedRole.id], function (err, res) {
    if (err) throw err;
    console.log("A new employee named " + answer.firstName + " " + answer.lastName + " has been added!\n");
    start();
  })
};
  