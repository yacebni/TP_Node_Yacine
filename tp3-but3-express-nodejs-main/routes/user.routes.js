import express from 'express'
import { getAllUsers, updateUser, createUser, getUserById } from '../controllers/user.controller.js'
import { verifyToken, restrictTo } from '../middleware/auth.middleware.js'

const userRouter = express.Router()

userRouter.use(verifyToken);

userRouter
    .route('/')
    .get(restrictTo('admin'), getAllUsers)
    .post(restrictTo('admin'), createUser)

userRouter
    .route('/:id')
    .get(getUserById)
    .put(updateUser)

export { userRouter }
