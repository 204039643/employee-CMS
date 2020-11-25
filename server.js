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

//Start user prompting in console
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
          'Add a role',
          'Remove an employee',
          'Update an employee role',
          "Update an employee's manager",
          'Quit'
        ]
      }
    ])
    .then(response => {
      if (response.userAction === 'View all employees') {
        viewAll()
      } else if (response.userAction === 'View employees by department') {
        connection.query('select name from department;', (err, res) => {
          if (err) throw err
          inquirer
            .prompt([
              {
                type: 'list',
                name: 'departmentName',
                message: 'Please select a department:',
                choices: function () {
                  var departmentArray = []
                  for (var i = 0; i < res.length; i++) {
                    departmentArray.push(res[i].name + ' ' + (i + 1))
                  }
                  return departmentArray
                }
              }
            ])
            .then(response => {
              const department = response
              viewDepartment(department)
            })
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
                choices: ['None', 'Sweeny Todd 4', 'Linda Sykes 5']
              }
            ])
            .then(response => {
              const newEmployee = response
              addEmployee(newEmployee)
            })
        })
      } else if (response.userAction === 'Add a role') {
        connection.query('select id, name from department;', (err, res) => {
          if (err) throw err
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'newTitle',
                message: 'Enter new role: '
              },
              {
                type: 'input',
                name: 'newSalary',
                message: 'Enter salary for new role: '
              },
              {
                type: 'rawlist',
                name: 'selectDepartment',
                message: 'Select department for new role:',
                choices: function () {
                  var deptArray = []
                  for (var i = 0; i < res.length; i++) {
                    deptArray.push(res[i].name + ' ' + (i + 1))
                  }
                  return deptArray
                }
              }
            ])
            .then(response => {
              const newRole = response
              addRole(newRole)
            })
        })
      } else if (response.userAction === 'Remove an employee') {
        connection.query(
          'select first_name, last_name from employee;',
          (err, res) => {
            if (err) throw err
            inquirer
              .prompt([
                {
                  type: 'rawlist',
                  name: 'employeeDelete',
                  message: 'Please select employee to remove:',
                  choices: function () {
                    var delArray = []
                    for (var i = 0; i < res.length; i++) {
                      delArray.push(res[i].first_name + ' ' + res[i].last_name)
                    }
                    return delArray
                  }
                }
              ])
              .then(response => {
                const oldEmployee = response
                delEmployee(oldEmployee)
              })
          }
        )
      } else if (response.userAction === 'Update an employee role') {
        connection.query(
          'select first_name, last_name from employee;',
          (err, res) => {
            if (err) throw err
            inquirer
              .prompt([
                {
                  type: 'rawlist',
                  name: 'employeeSelect',
                  message: 'Please select employee to update:',
                  choices: function () {
                    var updateRoleArray = []
                    for (var i = 0; i < res.length; i++) {
                      updateRoleArray.push(
                        res[i].first_name + ' ' + res[i].last_name
                      )
                    }
                    return updateRoleArray
                  }
                },
                {
                  type: 'list',
                  name: 'employeeRoleUpdate',
                  message: 'Select new role:',
                  choices: [
                    'developer - 1',
                    'sales rep - 2',
                    'finance manager - 3',
                    'manager - 4'
                  ]
                }
              ])
              .then(response => {
                const roleUpdate = response
                updateEmployeeRole(roleUpdate)
              })
          }
        )
      } else if (response.userAction === "Update an employee's manager") {
        connection.query(
          'select first_name, last_name from employee;',
          (err, res) => {
            if (err) throw err
            inquirer
              .prompt([
                {
                  type: 'rawlist',
                  name: 'employeeSelect',
                  message: 'Please select employee to update:',
                  choices: function () {
                    var updateRoleArray = []
                    for (var i = 0; i < res.length; i++) {
                      updateRoleArray.push(
                        res[i].first_name + ' ' + res[i].last_name
                      )
                    }
                    return updateRoleArray
                  }
                },
                {
                  type: 'list',
                  name: 'employeeManagerUpdate',
                  message: 'Select new manager:',
                  choices: ['None ', 'Sweeny Todd 4', 'Linda Sykes 5']
                }
              ])
              .then(response => {
                const managerUpdate = response
                updateEmployeeManager(managerUpdate)
              })
          }
        )
      } else connection.end()
    })
}

//build view that displays all employees including department and manager
const viewAll = () => {
  console.log('\n')
  connection.query(
    'select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as "department name", manager.first_name as manager from employee join role ON employee.role_id = role.id join department ON role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id order by id;',
    (err, res) => {
      if (err) throw err
      console.table(res)
      promptStart()
    }
  )
}

//View employees by department (similar to view all but filtered to selected department)
const viewDepartment = depart => {
  console.log('\n')
  connection.query(
    'select employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as "department name", manager.first_name as manager from employee join role ON employee.role_id = role.id join department ON role.department_id = department.id left JOIN employee manager on manager.id = employee.manager_id where department.?;',
    { id: depart.departmentName.charAt(depart.departmentName.length - 1) },
    (err, res) => {
      if (err) throw err
      console.table(res)
      promptStart()
    }
  )
}

//special view to show manager and direct reports as 2 columns ordered by manager
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

//add new employee to employee table using inputs from inquirer
const addEmployee = addEmp => {
  let newMan = addEmp.employeeManager.charAt(addEmp.employeeManager.length - 1)
  if ((newMan = 'None')) {
    newMan = null
  }
  console.log('\n')
  connection.query(
    'insert into employee SET ?;',
    {
      first_name: addEmp.firstName,
      last_name: addEmp.lastName,
      role_id: addEmp.employeeRole.charAt(addEmp.employeeRole.length - 1),
      manager_id: newMan
    },
    (err, res) => {
      if (err) throw err
      console.log('Added employee!')
      console.log('\n')
      promptStart()
    }
  )
}

//add new title to role table
const addRole = addTitle => {
  console.log('\n')
  connection.query(
    'insert into role SET ? ',
    {
      title: addTitle.newTitle,
      salary: addTitle.newSalary,
      department_id: addTitle.selectDepartment.charAt(
        addTitle.selectDepartment.length - 1
      )
    },
    (err, res) => {
      if (err) throw err
      console.log('Added role!')
      console.log('\n')
      promptStart()
    }
  )
}

//remove employee from employee table using inputs from inquirer
const delEmployee = delEmp => {
  console.log('\n')
  console.log(delEmp)
  connection.query(
    'delete from employee where first_name = ? and last_name = ?',
    [
      delEmp.employeeDelete.substr(0, delEmp.employeeDelete.indexOf(' ')),
      lastWord(delEmp.employeeDelete)
    ],
    (err, res) => {
      if (err) throw err
      console.log('Deleted employee!')
      console.log('\n')
      promptStart()
    }
  )
}

//update employee.role_id to employee table using inputs from inquirer prompts
const updateEmployeeRole = upRole => {
  console.log('\n')
  let upMan = upRole.employeeRoleUpdate.charAt(
    upRole.employeeRoleUpdate.length - 1
  )
  connection.query(
    'update employee set role_id = ? where first_name = ? and last_name = ?;',
    [
      upMan,
      upRole.employeeSelect.substr(0, upRole.employeeSelect.indexOf(' ')),
      lastWord(upRole.employeeSelect)
    ],
    (err, res) => {
      if (err) throw err
    }
  )
  //check for manager role and update to null if true
  if ((upMan = 4)) {
    connection.query(
      'update employee set manager_id = null where first_name = ? and last_name = ?;',
      [
        upRole.employeeSelect.substr(0, upRole.employeeSelect.indexOf(' ')),
        lastWord(upRole.employeeSelect)
      ],
      (err, res) => {
        if (err) throw err
      }
    )
  }
  console.log('Updated employee role!')
  console.log('\n')
  promptStart()
}

//Update manager ID for employee in employee table
const updateEmployeeManager = upManager => {
  console.log('\n')
  let upManOne = upManager.employeeManagerUpdate.charAt(
    upManager.employeeManagerUpdate.length - 1
  )
  //check for manager role and update to null if true
  if ((upManOne = null)) {
    connection.query(
      'update employee set manager_id = null where first_name = ? and last_name = ?;',
      [
        upManager.employeeSelect.substr(
          0,
          upManager.employeeSelect.indexOf(' ')
        ),
        lastWord(upRole.employeeSelect)
      ],
      (err, res) => {
        if (err) throw err
      }
    )
  } else {
    connection.query(
      'update employee set manager_id = ? where first_name = ? and last_name = ?;',
      [
        upManager.employeeManagerUpdate.charAt(
          upManager.employeeManagerUpdate.length - 1
        ),
        upManager.employeeSelect.substr(
          0,
          upManager.employeeSelect.indexOf(' ')
        ),
        lastWord(upManager.employeeSelect)
      ],
      (err, res) => {
        if (err) throw err
      }
    )
  }
  console.log("Updated employee's Manager!")
  console.log('\n')
  promptStart()
}

//select last word in string
const lastWord = words => {
  let n = words.replace(/[\[\]?.,\/#!$%\^&\*;:{}=\\|_~()]/g, '').split(' ')
  return n[n.length - 1]
}

//Functions calls
splash()
promptStart()
