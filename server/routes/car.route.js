import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { getCars } from '../controllers/car.controller.js'

const router = express.Router()

router.get('/getcars', verifyToken, getCars)

export default router