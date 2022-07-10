import express from 'express'
import { variantController } from '../controllers/variantController.js'

export const variantRouter = express.Router()
const { getByVariantId, resetWeightByVariantId, updateByVariantData } =
  variantController()

variantRouter.get('/', getByVariantId)
variantRouter.get('/weight', resetWeightByVariantId)
variantRouter.post('/', updateByVariantData)
