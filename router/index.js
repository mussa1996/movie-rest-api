import express from 'express'
const router = express.Router();
import movieRouter from './movieRouter.js'
import userRouter from './userRouter.js'

router.use('/movie',movieRouter)

router.use('/user',userRouter)

module.exports=router;