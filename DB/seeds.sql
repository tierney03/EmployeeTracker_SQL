INSERT INTO department(names)
VALUES ("Engineering"),
    ("Sales"),
    ("Finance"),
    ("Legal");
INSERT INTO roles(title, salary, department_id)
VALUES ("Software Engineer", 120000, 001),
    ("Account Manager", 160000, 002),
    ("CFO", 200000, 003),
    ("Lawyer", 50000, 004);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Nola", "Allen", 001, 1),
    ("Tierney", "Allen", 002, NULL),
    ("Theo", "Allen", 003, 1),
    ("Chris", "Allen", 004, 1);