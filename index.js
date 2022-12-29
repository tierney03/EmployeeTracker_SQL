//NPM Packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

//Connecting to mysql
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "company_db",
});

const viewAllOptions = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message:
          " Choose from the following options to start the process for updating the database.",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "I am done",
        ],
      },
    ])
    .then((answers) => {
      if (answers.option === "View all departments") {
        viewDepartments();
      } else if (answers.option === "View all roles") {
        viewRoles();
      } else if (answers.option === "View all employees") {
        viewEmployees();
      } else if (answers.option === "Add a department") {
        addDepartment();
      } else if (answers.option === "Add a role") {
        addRole();
      } else if (answers.option === "Add an employee") {
        addEmployee();
      } else if (answers.option === "Update an employee role") {
        updateEmployeeRole();
      } else if (answers.option === "I am done") {
        endPrompt();
      }
    });
};
viewAllOptions();

const viewDepartments = () => {
  db.query(`SELECT * FROM department`, function (err, res) {
    if (err) throw err;
    console.table(res);
    viewAllOptions();
  });
};

const viewRoles = () => {
  const mysql = `SELECT roles.id, roles.title, department.names AS department FROM roles LEFT JOIN department ON roles.department_id = department.id`;
  db.query(mysql, (err, res) => {
    if (err) throw err;
    console.table(res);
    viewAllOptions();
  });
};

const viewEmployees = () => {
  const mysql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.names AS department, roles.salary, CONCAT(mgr.first_name, mgr.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee mgr ON employee.manager_id = mgr.id`;
  db.query(mysql, (err, res) => {
    if (err) throw err;
    console.table(res);
    viewAllOptions();
  });
};

const addDepartment = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "names",
        message: "Enter the name of the department you want to add",
      },
    ])
    .then((answer) => {
      const mysql = `INSERT INTO department SET ?`;
      db.query(mysql, answer, (err, res) => {
        if (err) throw err;
        console.log(
          `${res.affectedRows} department was inserted into the database. \n`
        );
        viewAllOptions();
      });
    });
};

const addRole = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the name of the role you want to add.",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary you want for the new role.",
      },
      {
        type: "input",
        name: "department_id",
        message: "Enter the department for this new role.",
      },
    ])
    .then((answer) => {
      const mysql = `INSERT INTO roles SET ?`;
      db.query(mysql, answer, (err, res) => {
        if (err) throw err;
        console.log(
          `${res.affectedRows} role was inserted into the database. \n`
        );
        viewAllOptions();
      });
    });
};

const addEmployee = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the new employee's first name.",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the new employee's last name.",
      },
      {
        type: "input",
        name: "role_id",
        message: "Enter the new employee's role.",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Enter the new employee's manager.",
      },
    ])
    .then((answer) => {
      const mysql = `INSERT INTO employee SET ?`;
      db.query(mysql, answer, (err, res) => {
        if (err) throw err;
        console.log(
          `${res.affectedRows} employee was inserted into the database. \n`
        );
        viewAllOptions();
      });
    });
};

const updateEmployeeRole = () => {
  db.query(`SELECT * FROM employee`, (err, res) => {
    if (err) throw err;
    const employeeArray = res.map((empployee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    db.query(`SELECT * FROM roles`, (err, res) => {
      if (err) throw err;
      const roleArray = res.map((role) => ({
        name: `${role.title}`,
        value: role.id,
      }));

      return inquirer
        .prompt([
          {
            type: "list",
            name: "id",
            message: "Choose an employee to update.",
            choices: employeeArray,
          },
          {
            type: "list",
            name: "role_id",
            message: "Select the updated role for the chosen employee.",
            choices: roleArray,
          },
        ])
        .then((answer) => {
          const mysql = `UPDATE employee SET role_id=? WHERE id=?`;

          db.query(mysql, [answers.role_id, answers.id], (err, res) => {
            if (err) throw err;
            console.log(res);
            viewAllOptions();
          });
        });
    });
  });
};

const endPrompt = () => {
  console.log("Your database has been successfully updated.");
};
