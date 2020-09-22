var mysql = require("mysql");
var inquirer = require("inquirer");
var term = require('terminal-kit').terminal;
const cTable = require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  // term.slowTyping('Employee Tracker\n', { flashStyle: term.brightWhite }, function() { process.exit(); }) ;
  start();
});


function start() {
  inquirer.prompt(
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add a new department, role, or employee",
        "View departments, roles, or employees",
        "Update employee roles",
        "View the total utilized budget of a department",
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
        case "View the total utilized budget of a department":
          viewBudget();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};

function addContent() {
  inquirer.prompt(
    {
      name: "addSomething",
      type: "list",
      message: "What would you like to add?",
      choices: ["Department", "Roles", "Employees"]
    }
    ).then(function (answer) {
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
      connection.query(query, [answer.addDept], function (err, res) {
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
  connection.query(query, [answer.title, answer.salary, selectedDept.id], function (err, res) {
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

function createNewEmployee(id) {
  var query = `INSERT INTO employee VALUES firstName = ? lastName = ? role_id = ?`;
  connection.query(query, [answer.firstName, answer.lastName, selectedRole.id], function (err, res) {
    if (err) throw err;
    console.log("A new employee named " + answer.firstName + " " + answer.lastName + " has been added!\n");
    start();
  })
};

//Called from the start function switch case if view something is selected
function viewContent() {
  inquirer.prompt(
    {
      name: "viewSomething",
      type: "list",
      message: "What would you like to views?",
      choices: ["Department", "Roles", "Employees"]
    }).then(function (answer) {
      switch (answer.viewSomething) {
        case "Department":
          viewDepartments();
          break;
        case "Roles":
          viewRoles();
          break;
        case "Employees":
          viewEmployees();
          break;
      }
    });
};

//Called from viewContent function is dept selected
function viewDepartments() {
    console.table(departments)
    start();
  };

//Called from viewContent function is roles selected
function viewRoles() {
  console.table(roles)
  start();
};

//Called from viewContent function is employees selected
function viewEmployees() {
  console.table(employees)
  start();
};

//Called from the start function switch case if update role selected
function updateRoles() {

};

//Called from start function switch case if view budget is selected
function viewBudget(){

};
