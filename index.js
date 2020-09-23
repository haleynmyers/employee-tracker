var mysql = require("mysql");
var inquirer = require("inquirer");
var term = require('terminal-kit').terminal;
// const cTable = require("console.table");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected as id " + connection.threadId + "\n");
  term.slowTyping(
    'EMPLOYEE TRACKER\n', { flashStyle: term.brightWhite },
    function () { start(); }
  );
});

function start() {
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "Update employee roles",
        "View the total utilized budget of a department",
        "Exit"
      ]
    }])
    .then(function (answer) {
      switch (answer.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a new department":
          addDepartment();
          break;
        case "Add a new role":
          addRole();
          break;
        case "Add a new employee":
          addEmployee();
          break;
        case "Update employee roles":
          selectEmp();
          break;
        case "exit":
          connection.end();
          break;
      }
    });
};

//called in addContent function if selected dept
function addDepartment() {
  inquirer.prompt([
    {
    name: "addDept",
    message: "What is the name of the new department?"
  }
]).then(function (answer) {
    connection.query(
      "INSERT INTO departments SET ?", {
      name: answer.addDept
    },
      function (err, res) {
        if (err) throw err;
        console.log(" Department Added!\n");
        start();
      }
    );
  });
}

//called in addContent function if selected role
function addRole() {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    //asking for the three properties on the roles table      
    inquirer.prompt([
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
        choices: res.map(item => item.name),
        message: "Select a department for this role"
      }
    ]).then(function (answers) {
      const selectedDept = res.find(dept => dept.id === answers.deptId);
        connection.query("INSERT INTO roles SET ?", 
        {
          title: answers.title,
          salary: answers.salary,
          dept_id: selectedDept
        },
          function (err, res) {
            if (err) throw err;
            console.log("New role added!\n");
            start();
          }
        );
      });
  })
};

function addEmployee() {
  connection.query("SELECT * FROM roles", function (err, results) {
    if (err) throw err;
    console.log(results);
    inquirer.prompt([
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
        choices: results.map(role => role.title),
        message: "Select a role for the employee"
      }
    ]).then(function (answers) {
        const selectedRole = results.find(role => role.id === answers.roleId);
        connection.query("INSERT INTO employees SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: selectedRole
          }, function (err, res) {
            if (err) throw err;
            console.log("Added new employee named " + answers.firstName + " " + answers.lastName + "\n");
            start();
          })
      })
  })
};

// function createNewEmployee(answers) {
//   connection.query(
//     "INSERT INTO employee SET ?", {
//       first_name: answer.firstName,
//       last_name: answer.lastName,
//       role_id: selectedRole
//     }, function (err, res) {
//     if (err) throw err;
//     console.log("Added new employee named " + answer.firstName + " " + answer.lastName + "\n");
//     start();
//   })
// };

//Called from viewContent function is dept selected
function viewDepartments() {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//Called from viewContent function is roles selected
function viewRoles() {
  connection.query(`SELECT * FROM roles`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//Called from viewContent function is employees selected
function viewEmployees() {
  connection.query(`SELECT * FROM employees`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

//Called from the start function switch case if update role selected
function selectEmp() {
  connection.query(`SELECT * FROM employees`, function (err, res) {
    inquirer.prompt([
      {
        name: "update",
        type: "rawlist",
        message: "Select the employee you wish to update",
        choices: res.map(item => item.firstName, item.lastName, item.id)
    }
  ]).then(function (answer) {
      const selectedEmp = res.find(item => item.id);
      console.log(selectedEmp);
      updateEmp(selectedEmp);
    })
  })
};

function updateEmp(thisid) {
  connection.query("SELECT * FROM roles", function (err, res) {
    inquirer.prompt([
      {
      type: "rawlist",
      name: "newRole",
      message: "Select the new role",
      choices: res.map(item => item.name, item.id)
    }
  ]).then(function (answer) {
      connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [answer.newRole, thisid],
        function (error) {
          if (error) throw err;
          start();
        }
      );
    })
  })
};
