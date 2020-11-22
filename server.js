//JS variables including requires
const inquirer = require('inquirer')
const mysql = require('mysql')
const cTable = require('console.table')
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
───────────────▓▓▓▓▓▓▓▓
 `

//Establish connection to MySql server
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Eastcobb1',
  database: 'CMS_db'
})

//Define functions
const splash = () => {
  //Test connection and handle any errors
  connection.connect(function (err) {
    if (err) throw err

  })
  console.log(splashMsg)
  console.log('connection successful!')
  console.log('\n')
}

const promptStart = () => {
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
          'Update an Employee',
          'Quit'
        ]
      }
    ])
    .then(response => {
      if (response.userAction === 'View all employees') {
        viewAll()
      } else if (response.userAction === 'View employees by department') {
        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'departmentName',
              message: 'Please select a department:',
              choices: ['Engineering', 'Sales', 'Finance', 'Management']
            }
          ])
          .then(response => {
            const department = response
            viewDepartment(department)
          })
      }
    })
}

const viewAll = () => {
  console.log('\n')
  connection.query(
    'select employee.id, first_name,last_name, title, salary, name as "department name" from employee join role ON employee.role_id = role.id join department ON role.department_id = department.id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
      promptStart()
    }
  )
}

const viewDepartment = depart => {
  console.log('\n')
  connection.query(
    `select employee.id, first_name,last_name, title, salary, name as "department name" from employee join role ON employee.role_id = role.id join department ON role.department_id = department.id where department.name = "${depart.departmentName}";`,
    (err, res) => {
      if (err) throw err
      console.table(res)
      promptStart()
    }
  )
}

//Functions calls
splash()
promptStart()
