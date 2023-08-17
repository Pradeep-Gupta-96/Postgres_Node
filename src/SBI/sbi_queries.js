// CREATE A TABLE IF IT'S NOT EXIST 
export const createTodoTable = `
CREATE TABLE IF NOT EXISTS todo(
    ID SERIAL PRIMARY KEY,
    name VARCHAR(225),
    email VARCHAR(225),
    age INT,
    DOB DATE,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Export the queries for CRUD operations
export const insertTodoQuery = `
INSERT INTO todo (name, email, age, DOB)
VALUES ($1, $2, $3, $4)
RETURNING *;
`

export const getAllTodoQuery="SELECT * FROM todo"

export const getTodoByIdQuery="SELECT * FROM todo WHERE id=$1"

export const  updateTodoByIdQuery=`
UPDATE todo
SET name=$2, email=$3, age=$4, DOB=$5
WHERE id=$1
RETURNING *;
`

export const deleteByIdQuery="DELETE FROM todo WHERE id=$1"
