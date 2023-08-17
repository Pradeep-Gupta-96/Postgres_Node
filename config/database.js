import pkg from 'pg';  // Import the entire pg package
const { Pool } = pkg;  // Destructure the Pool class from the package


// Configuration for the database connection
const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'recqarz',
  password: 'Hanuman',
  port: 5432,
};

// Create a new Pool instance for database connection
const pool = new Pool(dbConfig);

// Function to establish the database connection
const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

export { pool, connectToDatabase };
