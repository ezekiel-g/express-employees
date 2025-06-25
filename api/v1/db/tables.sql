CREATE TABLE departments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    location ENUM('New York', 'San Francisco', 'London') NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT name_format CHECK (name REGEXP '^[A-Za-z0-9 \\-''.,]{1,100}$'),
    CONSTRAINT code_format CHECK (
        code COLLATE utf8mb4_bin REGEXP '^[A-Z0-9]{1,20}$'
    ),
    CONSTRAINT is_active_department_format CHECK (is_active IN (0, 1))
);

CREATE TABLE employees (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    country_code VARCHAR(4) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    is_active TINYINT DEFAULT 1,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT first_name_format CHECK (
        first_name REGEXP '^[A-Za-zÀ-ÿ ''-]{1,100}$'
    ),
    CONSTRAINT last_name_format CHECK (
        last_name REGEXP '^[A-Za-zÀ-ÿ ''-]{1,100}$'
    ),
    CONSTRAINT title_format CHECK (title REGEXP '^[A-Za-zÀ-ÿ ''-]{1,100}$'),
    CONSTRAINT email_format CHECK (
        email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'
    ),
    CONSTRAINT country_code_format CHECK (country_code REGEXP '^[0-9]{1,4}$'),
    CONSTRAINT phone_number_format CHECK (phone_number REGEXP '^[0-9]{7,15}$'),
    CONSTRAINT is_active_employee_format CHECK (is_active IN (0, 1))
);
