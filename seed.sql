DROP DATABASE IF EXISTS CMS_db;
CREATE DATABASE CMS_db;
USE CMS_db;

CREATE TABLE department(
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id)
);

insert into department (name)
values ("engineering");

insert into role (title,salary,department_id)
values ("developer","125000","100");

insert into employee (first_name,last_name,role_id,manager_id)
values ("John","Doe","10","101");