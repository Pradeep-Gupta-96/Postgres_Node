import { pool } from '../../config/database.js'
import { createTodoTable, deleteByIdQuery, getAllTodoQuery, getTodoByIdQuery, insertTodoQuery, updateTodoByIdQuery } from './sbi_queries.js'

export const createTodoTablee = async (req, res) => {
    try {
        pool.query(createTodoTable, (error, result) => {
            if (error) throw error
        })
        res.status(200).json({ message: "Table Created Successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const insertTodo = async (req, res) => {
    const currentUser = req.user;
    const { name, email, age, DOB } = req.body
    try {
        const result = await pool.query(insertTodoQuery, [name, email, age, DOB])
        res.status(201).json({ message: result.rows[0], user: currentUser })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


export const gellAllTodo = async (req, res) => {
    try {
        const result = await pool.query(getAllTodoQuery)
        res.status(202).json({ message: result.rows })
    } catch (error) {
        res.status(500).json({ err: error, message: "An error accured on the server side" })
    }
}


export const getbyid = async (req, res) => {
    try {
        const id = req.params.id
        const result = await pool.query(getTodoByIdQuery, [id])
        res.status(202).json({ message: result.rows[0] })
    } catch (error) {
        res.json(500).json({ err: error, message: "An Error Accured on the server side" })
    }
}


export const updateTodo = async (req, res) => {
    const id = req.params.id
    const { name, email, age, DOB } = req.body
    try {
        const result = await pool.query(updateTodoByIdQuery, [id, name, email, age, DOB])
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Data not found" })
        } else {
            return res.status(200).json({ message: result.rows[0] })
        }
    } catch (error) {
        res.status(500).json({ err: error, message: "An Error Accured on the sever side" })
    }
}


export const deleteTodo = async (req, res) => {
    try {
        const id = req.params.id
        const result = await pool.query(deleteByIdQuery, [id])
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Todo not Found" })
        } else {
            res.status(204).send()
        }
    } catch (error) {
        res.status(500).json({ err: error, message: "An error accured on the server side" })
    }
}



