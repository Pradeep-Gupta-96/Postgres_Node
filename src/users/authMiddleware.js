import jwt from "jsonwebtoken";
import { pool } from "../../config/database.js"; // Import your PostgreSQL connection pool here
import { checkEmailExist } from "./user_queries.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Retrieve user information from the database using the decoded token
        const userResult = await pool.query(checkEmailExist, [decoded.user]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Attach user information to the request object
        req.user = userResult.rows[0];
        next(); // Move to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};
