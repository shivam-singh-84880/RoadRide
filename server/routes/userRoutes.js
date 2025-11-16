import express, { Router } from 'express';
import { getUserData, loginUser, registerUser } from "../controllers/userController.js";
import { protect } from '../middleware/auth.js';


const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
export default userRouter;
