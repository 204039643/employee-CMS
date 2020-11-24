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
      } else if (response.userAction === 'View employees by manager') {
        viewManager()
      } else if (response.userAction === 'Add an employee') {
        connection.query('select title from role;', (err, res) => {
          if (err) throw err
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'firstName',
                message: 'New employee first name?'
              },
              {
                type: 'input',
                name: 'lastName',
                message: 'New employee last name?'
              },
              {
                type: 'rawlist',
                name: 'employeeRole',
                message: 'Please select employee role:',
                choices: function () {
                  var roleArray = []
                  for (var i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title + ' ' + (i + 1))
                  }
                  return roleArray
                }
              },
              {
                type: 'rawlist',
                name: 'employeeManager',
                message: 'Please select a manager:',
                choices: ['None ', 'Sweeny Todd 4', 'Linda Sykes 5']
              }
            ])
            .then(response => {
              const newEmployee = response
              addEmployee(newEmployee)
            })
        })
      }
      else connection.end()
    })
}

const viewAll = () => {
  console.log('\n')
  connection.query(
    'select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as "department name", manager.first_name as manager from employee join role ON employee.role_id = role.id join department ON role.department_id = department.id JOIN employee manager on manager.id = employee.manager_id order by id;',
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

const viewManager = () => {
  console.log('\n')
  connection.query(
    `SELECT 
    e.id,
    CONCAT(e.last_name, ', ', e.first_name) AS Employee,
    CONCAT(m.last_name, ', ', m.first_name) AS Manager
  FROM
      employee e
  INNER JOIN employee m ON 
      m.id = e.manager_id
      order by manager;`,
    (err, res) => {
      if (err) throw err
      console.table(res)
      promptStart()
    }
  )
}

const addEmployee = addEmp => {
  console.log('\n')
  connection.query(
    'insert into employee SET ?;',
    {
      first_name: addEmp.firstName,
      last_name: addEmp.lastName,
      role_id: addEmp.employeeRole.charAt(addEmp.employeeRole.length - 1),
      manager_id: addEmp.employeeManager.charAt(addEmp.employeeManager.length - 1)
    },
    (err, res) => {
      if (err) throw err
      console.log('Added employee!')
      console.log('\n')
      promptStart()
    }
  )
}

//Functions calls
splash()
promptStart()
