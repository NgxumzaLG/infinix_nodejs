const express = require('express');
const router = express.Router();
const { db } = require("../models");

// TODO:
// 1. Remove all employees from the tenth department
// 2. Find the employee with the highest salary range (max_salary) and minimum (min_salary)
// 3. Output information from the database about the employee with the role of "President"
// 4. Get all the employees who are in London

router.get('/', (request, response) => {
  
  db.query('SELECT * FROM countries', (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    response.status(200).json(results.rows);
  })
  
});

// TODO #1
router.get('/delete', (request, response) => {
  const query = `DELETE FROM employees
                WHERE department_id = 10`;
  
  db.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json({message: 'Data has been successfully deleted'});
  })
  
});

// TODO #2
router.get('/range', (request, response) => {
  const query = `SELECT employees.*, jobs_updated.salary_range, jobs_updated.job_title
                FROM employees 
                JOIN (SELECT * , (max_salary - min_salary) AS salary_range 
                FROM jobs) AS jobs_updated ON  employees.job_id = jobs_updated.job_id
                ORDER BY jobs_updated.salary_range DESC LIMIT 1`;
  
  db.query(query, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    response.status(200).json(results.rows);
  })
  
});

// TODO #3
router.get('/president', (request, response) => {
  const query = `SELECT r.region_name, c.country_name, l.street_address, l.city, l.state_province, 
                d.department_name, e.*, j.job_title, j.min_salary, j.max_salary,
                dp.first_name AS dependent_first_name, dp.last_name AS dependent_last_name, dp.relationship
                FROM regions AS r
                JOIN countries AS c ON r.region_id = c.region_id
                JOIN locations AS l ON l.country_id = c.country_id
                JOIN departments AS d ON l.location_id = d.location_id
                JOIN employees AS e ON d.department_id = e.department_id
                JOIN jobs AS j ON e.job_id = j.job_id
                JOIN dependents AS dp ON e.employee_id = dp.employee_id
                WHERE j.job_title = 'President' `;  

  db.query(query, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    response.status(200).json(results.rows);
  })
  
});

// TODO #4
router.get('/london', (request, response) => {
  const query = `SELECT e.first_name, e.last_name, d.department_name, l.city, l.state_province
                FROM employees AS e
                JOIN departments AS d ON d.department_id = e.department_id
                JOIN locations AS l ON l.location_id = d.location_id
                WHERE l.city = 'London'`;
  
  db.query(query, (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows);
    response.status(200).json(results.rows);
  })
  
});

module.exports = router;
