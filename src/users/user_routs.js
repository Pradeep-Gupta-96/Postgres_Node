import express from "express";
import { authMiddleware } from "./authMiddleware.js";
import {
    createUserTable,
    getAllUsers,
    requestPasswordReset,
    resetPassword,
    signin,
    signup,
    logout,
    verifyOTP
} from "./user_controllers.js";
export const router = express.Router()

router.get('/createUserTable', createUserTable)
router.post('/signup', signup)
router.post('/verifyOTP',verifyOTP)
router.get('/', getAllUsers)
router.post('/signin', signin)
router.post('/requestPasswordReset', requestPasswordReset)
router.put('/resetPassword', resetPassword)
router.post("/logout",authMiddleware, logout);