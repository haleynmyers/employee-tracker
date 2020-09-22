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
const { allowedNodeEnvironmentFlags } = require("process");
​
var connection = mysql.createConnection({
  host: "localhost",
​  port: 3306,
​  user: "root",
​  password: "",
  database: "employee_DB"
});
​
connection.connect(function(err) {
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
      .then(function(answer) {
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
        }).then(function(answer) {
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
        }});
}

//called in addContent function
function addDepartment() {
    inquirer
        .prompt({
            name: "addDept",
            type: "input",
            message: "What is the name of the new department?"
        }).then(function(answer) {
        var query = `INSERT INTO department(role) VALUE ?`;
        connection.query(query, answer.addDept, function(err, res) {
            if (err) throw err;
            console.log("A new department named " + answer.addDept + " has been added!\n");
            start();
    })
})};

function addRole() {
    //grabs all the dept names and ids so we can assign dept_id later
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
    //asking for the three properties on the roles table      
    inquirer
        .prompt({
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
            choices: results.map(departments => departments.id, departments.name),
            message: "What department is this role in?"
        })
        //Inserting new role properties to the table
        .then(function(answer) {
        var query = `INSERT INTO roles(title, salary, dept_id) VALUES ?`;
        connection.query(query, answer.deptId, function(err, res) {
            if (err) throw err;
            console.log("A new role has been added. \nTitle: " + answer.title + "\nSalary: " + answer.salary + "\nIn department " + answer.deptId);
            start();
        })})
    }
)};

function addEmployee() {
    connection.query("SELECT * FROM roles", function(err, results) {
        if (err) throw err;
    inquirer
        .prompt(
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
            choices: results.map(roles => roles.id, roles.name),
            message: "What role does this employee have?"
        }
        ).then(function(answer) {
        var query = `INSERT INTO department(role) VALUES ?`;
        connection.query(query, answer.addDept, function(err, res) {
            if (err) throw err;
            console.log("A new department named " + answer.addDept + " has been added!\n");
            start();
    })
})})};
