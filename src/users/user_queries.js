// SQL query to create the users table if it doesn't exist
export const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// SQL query to retrieve all users from the users table
export const getUsers = 'SELECT * FROM users';

// SQL query to check if a user with a given email exists in the users table
export const checkEmailExist = 'SELECT * FROM users WHERE email = $1';

// SQL query to insert a new user into the users table and return the inserted user
export const insertUserQuery = `
    INSERT INTO users (username, email, role, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *`; // The RETURNING clause returns the inserted row
