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
        message: "Select a department for this role",
        choices: res.map(item => item.name)
      }
    ]).then(function (answers) {
      const selectedDept = res.find(dept => dept.name === answers.deptId);
        connection.query("INSERT INTO roles SET ?", 
        {
          title: answers.title,
          salary: answers.salary,
          dept_id: selectedDept.id
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
        choices: results.map(item => item.title),
        message: "Select a role for the employee"
      }
    ]).then(function (answers) {
        const selectedRole = results.find(item => item.title === answers.roleId);
        connection.query("INSERT INTO employees SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: selectedRole.id
          }, function (err, res) {
            if (err) throw err;
            console.log("Added new employee named " + answers.firstName + " " + answers.lastName + "\n");
            start();
          })
      })
  })
};

function viewDepartments() {
  connection.query(`SELECT * FROM departments`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

function viewRoles() {
  connection.query(`SELECT * FROM roles`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

function viewEmployees() {
  connection.query(`SELECT * FROM employees`, function (err, res) {
    if (err) throw err;
    console.table(res);
    start();
  })
};

function selectEmp() {
  connection.query("SELECT * FROM employees", function (err, res) {
    inquirer.prompt([
      {
      type: "rawlist",
      name: "selectEmp",
      message: "Select the employee who is changing roles",
      choices: res.map(emp => emp.id)
    }
  ]).then(function (answer) {
      const selectedEmp = res.find(emp => emp.id === answer.selectEmp);
      connection.query("SELECT * FROM roles", function (err, res) {
        inquirer.prompt([
          {
          type: "rawlist",
          name: "newRole",
          message: "Select the new role for this employee",
          choices: res.map(item => item.title)
        }
      ]).then(function (answer) {
        const selectedRole = res.find(role => role.title === answer.newRole);
    
          connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmp.id],
            function (error) {
              if (error) throw err;
              start();
            }
          );
        })
      })    })
  })
};

// function updateEmp() {
//   connection.query("SELECT * FROM roles", function (err, res) {
//     inquirer.prompt([
//       {
//       type: "rawlist",
//       name: "newRole",
//       message: "Select the new role for this employee",
//       choices: res.map(item => item.title)
//     }
//   ]).then(function (answer) {
//     const selectedRole = res.find(role => role.title === answer.newRole);

//       connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmp.id],
//         function (error) {
//           if (error) throw err;
//           start();
//         }
//       );
//     })
//   })
// };
