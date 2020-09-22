DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;
USE employee_DB;

CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT=100 NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL, 
    dept_id  INT NOT NULL
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT=1000 NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT UNSIGNED NOT NULL,
    manager_id INT NULL
);
