import express from "express";
import {config} from 'dotenv'
import { connectToDatabase } from "./config/database.js";
import { router as userRouter } from "./src/users/user_routs.js";
import { router as todoRouter } from "./src/SBI/sbi_routs.js";

const app = express(); // Create an instance of the Express application
app.use(express.json()); // Enable JSON body parsing

config({
    path: './config/config.env' // Load environment variables from config.env file
})

// Call the connectToDatabase function to establish the connection
connectToDatabase();

// Define a simple route for the root endpoint
app.get('/', (req, res) => {
    res.send("vighnharth shree ganesha deva"); // Respond with a simple message
});

// Use the user router for paths starting with '/api'
app.use('/api', userRouter);

// Use the sbi router for paths starting with '/api/v1'
app.use('/api/v1', todoRouter)

const PORT = process.env.PORT; // Get the port from environment variables
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Start the server and print a message
});

