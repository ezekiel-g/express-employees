-- Departments
INSERT INTO departments (
    name,
    code,
    location,
    is_active
)
VALUES
    ('Sales', 'SLS01', 'New York', TRUE),
    ('Marketing', 'MKT01', 'New York', TRUE),
    ('Engineering', 'ENG01', 'London', TRUE),
    ('HR', 'HR01', 'San Francisco', TRUE);

-- Employees
INSERT INTO employees (
    first_name,
    last_name,
    title,
    email,
    hire_date,
    department_id,
    country_code,
    phone_number,
    is_active
)
VALUES
    -- Sales Department
    ('John', 'Doe', 'Sales Manager', 'john.doe@example.com', '2021-03-15', 1, '1', '5551234567', TRUE),
    ('Jane', 'Smith', 'Sales Representative', 'jane.smith@example.com', '2020-07-25', 1, '1', '5552345678', TRUE),
    ('Alice', 'Johnson', 'Sales Associate', 'alice.johnson@example.com', '2019-11-02', 1, '1', '5553456789', TRUE),
    ('Bob', 'Brown', 'Sales Representative', 'bob.brown@example.com', '2022-01-12', 1, '1', '5554567890', TRUE),
    ('Charlie', 'Davis', 'Sales Associate', 'charlie.davis@example.com', '2021-06-10', 1, '1', '5555678901', TRUE),
    ('David', 'Schmidt', 'Sales Coordinator', 'david.schmidt@example.com', '2020-02-28', 1, '49', '5556789012', TRUE),

    -- Marketing Department
    ('William', 'Scott', 'Marketing Manager', 'william.scott@example.com', '2021-05-05', 2, '1', '5551236547', TRUE),
    ('Olivia', 'Koch', 'Marketing Specialist', 'olivia.koch@example.com', '2020-08-20', 2, '49', '5552347658', TRUE),
    ('James', 'Baker', 'Marketing Coordinator', 'james.baker@example.com', '2022-06-12', 2, '49', '5553458769', TRUE),
    ('Charlotte', 'Gonzalez', 'Senior Marketing Strategist', 'charlotte.gonzalez@example.com', '2019-04-08', 2, '34', '5554569870', TRUE),
    ('Emma', 'Martinez', 'Marketing Specialist', 'emma.martinez@example.com', '2021-11-30', 2, '1', '5555670981', TRUE),
    ('Noah', 'Taylor', 'Marketing Analyst', 'noah.taylor@example.com', '2020-07-16', 2, '1', '5556781092', TRUE),
    ('Mia', 'Davis', 'Marketing Assistant', 'mia.davis@example.com', '2019-09-01', 2, '49', '5557892103', TRUE),
    ('Lucas', 'Clark', 'Junior Marketing Coordinator', 'lucas.clark@example.com', '2021-10-05', 2, '1', '5558903214', TRUE),
    ('Harper', 'Allen', 'Digital Marketing Specialist', 'harper.allen@example.com', '2022-01-18', 2, '34', '5559014325', TRUE),

    -- Engineering Department
    ('Emma', 'Williams', 'Software Engineer', 'emma.williams@example.com', '2021-03-10', 3, '1', '5551231234', TRUE),
    ('Oliver', 'Miller', 'Senior Software Engineer', 'oliver.miller@example.com', '2020-06-15', 3, '1', '5552342345', TRUE),
    ('Liam', 'Wilson', 'Engineering Lead', 'liam.wilson@example.com', '2019-12-01', 3, '1', '5553453456', TRUE),
    ('Sophia', 'Nguyen', 'Junior Software Engineer', 'sophia.nguyen@example.com', '2022-02-10', 3, '61', '5554564567', TRUE),
    ('Mason', 'Santos', 'Software Engineer', 'mason.santos@example.com', '2021-07-15', 3, '1', '5555675678', TRUE),
    ('Isabella', 'Klein', 'Frontend Developer', 'isabella.klein@example.com', '2020-09-20', 3, '49', '5556786789', TRUE),
    ('Elijah', 'Schneider', 'Backend Developer', 'elijah.schneider@example.com', '2021-11-05', 3, '49', '5557897890', TRUE),
    ('Ava', 'Jackson', 'Software Engineer', 'ava.jackson@example.com', '2019-03-25', 3, '1', '5558908901', TRUE),
    ('James', 'Garcia', 'DevOps Engineer', 'james.garcia@example.com', '2022-01-15', 3, '1', '5559019012', TRUE),
    ('Ethan', 'Santos', 'QA Engineer', 'ethan.santos@example.com', '2021-10-01', 3, '55', '5555678765', TRUE),

    -- HR Department
    ('Lucas', 'Harris', 'HR Manager', 'lucas.harris@example.com', '2021-02-01', 4, '1', '5551234321', TRUE),
    ('Mia', 'Lopez', 'HR Specialist', 'mia.lopez@example.com', '2020-04-05', 4, '1', '5552345432', TRUE),
    ('Benjamin', 'Rodriguez', 'HR Coordinator', 'benjamin.rodriguez@example.com', '2022-03-15', 4, '1', '5553456543', TRUE),
    ('Harper', 'Weber', 'Senior HR Manager', 'harper.weber@example.com', '2019-09-25', 4, '49', '5554567654', TRUE),
    ('Zoe', 'Martin', 'HR Assistant', 'zoe.martin@example.com', '2020-11-18', 4, '1', '5556789876', TRUE);
    