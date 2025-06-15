CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    location ENUM('New York', 'San Francisco', 'London') NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT name_min_length CHECK (CHAR_LENGTH(name) >= 1),
    CONSTRAINT code_min_length CHECK (CHAR_LENGTH(code) >= 1)
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    department_id INT,
    email VARCHAR(255) UNIQUE NOT NULL,
    country_code VARCHAR(4) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    is_active TINYINT DEFAULT 1,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CHECK (country_code REGEXP '^[0-9]{1,4}$'),
    CHECK (phone_number REGEXP '^[0-9]{7,15}$')
);
