-- Departments
INSERT INTO departments (
    name,
    code,
    location,
    is_active
)
VALUES
    ('Sales', 'SLS01', 'New York', 1),
    ('Marketing', 'MKT01', 'New York', 1),
    ('Engineering', 'ENG01', 'London', 1),
    ('HR', 'HR01', 'San Francisco', 1);

-- Employees
INSERT INTO employees (
    first_name,
    last_name,
    title,
    department_id,
    email,
    country_code,
    phone_number,
    is_active,
    hire_date
)
VALUES
    -- Sales department
    ('John', 'Doe', 'Sales Manager', 1, 'john.doe@example.com', '1', '5551234567', 1, '2021-03-15'),
    ('Jane', 'Smith', 'Sales Representative', 1, 'jane.smith@example.com', '1', '5552345678', 1, '2020-07-25'),
    ('Alice', 'Johnson', 'Sales Associate', 1, 'alice.johnson@example.com', '1', '5553456789', 1, '2019-11-02'),
    ('Bob', 'Brown', 'Sales Representative', 1, 'bob.brown@example.com', '1', '5554567890', 1, '2022-01-12'),
    ('Charlie', 'Davis', 'Sales Associate', 1, 'charlie.davis@example.com', '1', '5555678901', 1, '2021-06-10'),
    ('David', 'Schmidt', 'Sales Coordinator', 1, 'david.schmidt@example.com', '49', '5556789012', 1, '2020-02-28'),

    -- Marketing department
    ('William', 'Scott', 'Marketing Manager', 2, 'william.scott@example.com', '1', '5551236547', 1, '2021-05-05'),
    ('Olivia', 'Koch', 'Marketing Specialist', 2, 'olivia.koch@example.com', '49', '5552347658', 1, '2020-08-20'),
    ('James', 'Baker', 'Marketing Coordinator', 2, 'james.baker@example.com', '49', '5553458769', 1, '2022-06-12'),
    ('Charlotte', 'Gonzalez', 'Senior Marketing Strategist', 2, 'charlotte.gonzalez@example.com', '34', '5554569870', 1, '2019-04-08'),
    ('Emma', 'Martinez', 'Marketing Specialist', 2, 'emma.martinez@example.com', '1', '5555670981', 1, '2021-11-30'),
    ('Noah', 'Taylor', 'Marketing Analyst', 2, 'noah.taylor@example.com', '1', '5556781092', 1, '2020-07-16'),
    ('Mia', 'Davis', 'Marketing Assistant', 2, 'mia.davis@example.com', '49', '5557892103', 1, '2019-09-01'),
    ('Lucas', 'Clark', 'Junior Marketing Coordinator', 2, 'lucas.clark@example.com', '1', '5558903214', 1, '2021-10-05'),
    ('Harper', 'Allen', 'Digital Marketing Specialist', 2, 'harper.allen@example.com', '34', '5559014325', 1, '2022-01-18'),

    -- Engineering department
    ('Emma', 'Williams', 'Software Engineer', 3, 'emma.williams@example.com', '1', '5551231234', 1, '2021-03-10'),
    ('Oliver', 'Miller', 'Senior Software Engineer', 3, 'oliver.miller@example.com', '1', '5552342345', 1, '2020-06-15'),
    ('Liam', 'Wilson', 'Engineering Lead', 3, 'liam.wilson@example.com', '1', '5553453456', 1, '2019-12-01'),
    ('Sophia', 'Nguyen', 'Junior Software Engineer', 3, 'sophia.nguyen@example.com', '61', '5554564567', 1, '2022-02-10'),
    ('Mason', 'Santos', 'Software Engineer', 3, 'mason.santos@example.com', '1', '5555675678', 1, '2021-07-15'),
    ('Isabella', 'Klein', 'Frontend Developer', 3, 'isabella.klein@example.com', '49', '5556786789', 1, '2020-09-20'),
    ('Elijah', 'Schneider', 'Backend Developer', 3, 'elijah.schneider@example.com', '49', '5557897890', 1, '2021-11-05'),
    ('Ava', 'Jackson', 'Software Engineer', 3, 'ava.jackson@example.com', '1', '5558908901', 1, '2019-03-25'),
    ('James', 'Garcia', 'DevOps Engineer', 3, 'james.garcia@example.com', '1', '5559019012', 1, '2022-01-15'),
    ('Ethan', 'Santos', 'QA Engineer', 3, 'ethan.santos@example.com', '55', '5555678765', 1, '2021-10-01'),

    -- HR department
    ('Lucas', 'Harris', 'HR Manager', 4, 'lucas.harris@example.com', '1', '5551234321', 1, '2021-02-01'),
    ('Mia', 'Lopez', 'HR Specialist', 4, 'mia.lopez@example.com', '1', '5552345432', 1, '2020-04-05'),
    ('Benjamin', 'Rodriguez', 'HR Coordinator', 4, 'benjamin.rodriguez@example.com', '1', '5553456543', 1, '2022-03-15'),
    ('Harper', 'Weber', 'Senior HR Manager', 4, 'harper.weber@example.com', '49', '5554567654', 1, '2019-09-25'),
    ('Zoe', 'Martin', 'HR Assistant', 4, 'zoe.martin@example.com', '1', '5556789876', 1, '2020-11-18');
