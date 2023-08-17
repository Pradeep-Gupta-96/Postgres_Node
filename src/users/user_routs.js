import express from "express";
import {createUserTable, getAllUsers, signin, signup } from "./user_controllers.js";
export const router=express.Router()

router.get('/createUserTable',createUserTable)
router.post('/signup', signup)
router.get('/', getAllUsers)
router.post('/signin', signin)