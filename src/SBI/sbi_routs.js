import express from "express";
import {
    createTodoTablee,
    deleteTodo,
    gellAllTodo,
    getbyid,
    insertTodo,
    updateTodo
} from "./sbi_controllers.js";
import { authMiddleware } from "../users/authMiddleware.js";

export const router = express.Router()
router.get('/createTodoTablee', createTodoTablee)
router.get('/', authMiddleware, gellAllTodo)
router.get('/:id', authMiddleware, getbyid)
router.post('/', authMiddleware, insertTodo)
router.put('/:id', authMiddleware, updateTodo)
router.delete('/:id', authMiddleware, deleteTodo)