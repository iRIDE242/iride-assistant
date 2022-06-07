import express from 'express'
import { variantController } from '../controllers/variantController.js'

export const variantRouter = express.Router()
const { getByVariantId } = variantController()

variantRouter.get('/', getByVariantId)
