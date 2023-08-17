import { pool } from "../../config/database.js"; // Import your PostgreSQL connection pool here
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    checkEmailExist,
    checkTokensQuerry,
    createUsersTable,
    getUsers,
    insertUserQuery,
    requestPassQuery,
    updatePassQuery,
    update_last_login_active_ip_query,
    userstatusQuery
} from "./user_queries.js";
import { sendPasswordResetEmail } from "./emailService.js";


// Define a function to create the users table if it doesn't exist
export const createUserTable = async (req, res) => {
    try {
        // Execute the SQL query to create the users table
        pool.query(
            createUsersTable, (error, result) => {
                if (error) throw error; // Throw an error if the query encounters an error
            });

        res.status(200).json({ message: "Table created successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors and respond with an error message
    }
};


export const signup = async (req, res) => {
    try {
        const { username, email, role, password, phone_number, profile_image_url } = req.body;

        if (!username || !email || !role || !password || !phone_number) {
            return res.status(400).json({ message: "Please fill all details" });
        } else {
            // Check if the user with the given email already exists
            const userExistResult = await pool.query(
                checkEmailExist,
                [email]
            );

            if (userExistResult.rows.length > 0) {
                return res.status(400).json({ message: "User already registered" });
            } else {
                // Hash the password before storing it
                const hashPassword = await bcrypt.hash(password, 10);

                // Insert the new user into the database and return the inserted user
                const newUserResult = await pool.query(
                    insertUserQuery,
                    [username, email, role, hashPassword, phone_number, profile_image_url]
                );

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
            const userResult = await pool.query(
                checkEmailExist,
                [email]
            );

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

                    // Get the user's IP address
                    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

                    // Update the user's last_login and active_ip fields
                    await pool.query(update_last_login_active_ip_query, [user.id, ipAddress]);

                    return res.status(200).json({ user, token });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Generate a reset token
const generateResetToken = () => {
    return Math.floor(100000 + Math.random() * 900000)
}

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Generate a reset token and expiration timestamp
        const resetToken = generateResetToken();
        const resetTokenExpiration = new Date(Date.now() + 3600000); // Expiration in one hour

        // Store the reset token and expiration in the database
        await pool.query(
            requestPassQuery,
            [email, resetToken, resetTokenExpiration]
        );

        // Retrieve user's data
        const userResult = await pool.query(
            checkEmailExist,
            [email]
        );
        const user = userResult.rows[0];

        // Send reset token to the user's email using the email service module
        await sendPasswordResetEmail(email, user.username, resetToken);

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Check if the reset token is valid and not expired
        const userResult = await pool.query(checkTokensQuerry, [email, resetToken]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "Invalid reset token" });
        } else {
            // Hash the new password
            const hashPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password and reset token fields
            await pool.query(
                updatePassQuery,
                [email, hashPassword]
            );

            return res.status(200).json({ message: "Password reset successful" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        // Retrieve user ID from the request or decoded token
        const userId = req.user.id; // Replace with the actual way you retrieve user ID

        // Update the user's fields
        await pool.query(
            userstatusQuery,
            [userId]
        );
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
