import { pool } from "../../config/database.js"; // Import your PostgreSQL connection pool here
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { checkEmailExist, createUsersTable, getUsers, insertUserQuery } from "./user_queries.js";

// Define a function to create the users table if it doesn't exist
export const createUserTable = async (req, res) => {
    try {
        // Execute the SQL query to create the users table
        pool.query(createUsersTable, (error, result) => {
            if (error) throw error; // Throw an error if the query encounters an error
        });
        
        res.status(200).json({ message: "Table created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors and respond with an error message
    }
};


export const signup = async (req, res) => {
    try {
        const { username, email, role, password } = req.body;

        if (!username || !email || !role || !password) {
            return res.status(400).json({ message: "Please fill all details" });
        } else {
            // Check if the user with the given email already exists
            const userExistResult = await pool.query(checkEmailExist, [email]);

            if (userExistResult.rows.length > 0) {
                return res.status(400).json({ message: "User already registered" });
            } else {
                // Hash the password before storing it
                const hashPassword = await bcrypt.hash(password, 10);

                // Insert the new user into the database and return the inserted user
                const newUserResult = await pool.query(insertUserQuery, [username, email, role, hashPassword]);

                const user = newUserResult.rows[0];
                const token = jwt.sign({ user: user.email, id: user.id }, process.env.SECRET_KEY);

                return res.status(200).json({ user, token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const usersResult = await pool.query(getUsers);
        res.status(200).json(usersResult.rows);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all details" });
        } else {
            // Retrieve the user by email
            const userResult = await pool.query(checkEmailExist, [email]);

            if (userResult.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            } else {
                const user = userResult.rows[0];

                // Compare the provided password with the hashed password in the database
                const matchPassword = await bcrypt.compare(password, user.password);

                if (!matchPassword) {
                    return res.status(400).json({ message: "Invalid credentials" });
                } else {
                    // Generate a JWT token upon successful authentication
                    const token = jwt.sign({ user: user.email, id: user.id }, process.env.SECRET_KEY);
                    return res.status(200).json({ user, token });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

