const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table');
const splashMsg = `----------------------------------------------------\r
EMPLOYEE-CMS APP START!
───────────▒▒▒▒▒▒▒▒
─────────▒▒▒──────▒▒▒
────────▒▒───▒▒▒▒──▒░▒
───────▒▒───▒▒──▒▒──▒░▒
──────▒▒░▒──────▒▒──▒░▒
───────▒▒░▒────▒▒──▒░▒
─────────▒▒▒▒▒▒▒───▒▒
─────────────────▒▒▒
─────▒▒▒▒────────▒▒
───▒▒▒░░▒▒▒─────▒▒──▓▓▓▓▓▓▓▓
──▒▒─────▒▒▒────▒▒▓▓▓▓▓░░░░░▓▓──▓▓▓▓
─▒───▒▒────▒▒─▓▓▒░░░░░░░░░█▓▒▓▓▓▓░░▓▓▓
▒▒──▒─▒▒───▓▒▒░░▒░░░░░████▓▓▒▒▓░░░░░░▓▓
░▒▒───▒──▓▓▓░▒░░░░░░█████▓▓▒▒▒▒▓▓▓▓▓░░▓▓
──▒▒▒▒──▓▓░░░░░░███████▓▓▓▒▒▒▒▒▓───▓▓░▓▓
──────▓▓░░░░░░███████▓▓▓▒▒▒▒▒▒▒▓───▓░░▓▓
─────▓▓░░░░░███████▓▓▓▒▒▒▒▒▒▒▒▒▓▓▓▓░░▓▓
────▓▓░░░░██████▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▓░░░░▓▓
────▓▓▓░████▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓▓▓
─────▓▓▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓
─────▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
──────▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓
───────▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓
─────────▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓▓▓
───────────▓▓▓▓▓▓▒▒▒▒▒▓▓▓▓
───────────────▓▓▓▓▓▓▓▓`;


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Eastcobb1',
  database: 'CMS_db'
})

connection.connect(function (err) {
  if (err) throw err
  console.log('connected as id ' + connection.threadId + '\n')
})

const promptStart = () => {
 console.log(splashMsg);
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'userAction',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'View employees by department',
          'View employees by manager',
          'Add an employee',
          'Delete an employee',
          'Update an Employee'
        ]
      }
    ])
    .then(response => {
      if (response.userAction === 'View all employees') {
        selectAll();
      } else if (response.userAction === 'View employees by department') {
        return inquirer
        .prompt([
          {
            type: 'list',
            name: 'departmentName',
            message: 'Please select a department:',
            choices: [
              'Engineering',
              'Sales',
              'Finance'
            ]
          }
        ])
        .then(response => {
            console.log(response);
            viewDepartment();
            return response;
        })
      }
    })
}

const selectAll = () => {
  connection.query('select * from employee;', (err, res) => {
    if (err) throw err
    console.table(res)
  })
}

const viewDepartment = () => {
    connection.query(`select * from department inner join employee on department.id = employee.id where department.name = "engineering";`, (err, res) => {
      if (err) throw err;
      console.table(res);
      connection.end();
    })
  }


promptStart()
