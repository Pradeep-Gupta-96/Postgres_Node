// SQL query to create the users table if it doesn't exist
export const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        last_login TIMESTAMP,
        active BOOLEAN DEFAULT false,
        active_ip VARCHAR(45),
        phone_number VARCHAR(20),
        profile_image_url VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expiration TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// SQL query to retrieve all users from the users table
export const getUsers = 'SELECT * FROM users';

// SQL query to check if a user with a given email exists in the users table
export const checkEmailExist = 'SELECT * FROM users WHERE email = $1';

// SQL query to insert a new user into the users table and return the inserted user
export const insertUserQuery = `
    INSERT INTO users (username, email, role, password,phone_number, profile_image_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`; // The RETURNING clause returns the inserted row

// Store the reset token and expiration in the database
export const requestPassQuery = 'UPDATE users SET reset_token = $2, reset_token_expiration = $3 WHERE email = $1'

// Check if the reset token is valid and not expired
export const checkTokensQuerry = 'SELECT * FROM users WHERE email = $1 AND reset_token = $2 AND reset_token_expiration > NOW()'

// Update the user's password and reset token fields
export const updatePassQuery = 'UPDATE users SET password = $2, reset_token = NULL, reset_token_expiration = NULL WHERE email = $1'

// Update the user's last_login and active_ip fields
export const update_last_login_active_ip_query='UPDATE users SET last_login = NOW(), active = true, active_ip = $2 WHERE id = $1'

// Update the user's 'active' status to false 
export const userstatusQuery='UPDATE users SET is_verified = false, active = false WHERE id = $1'