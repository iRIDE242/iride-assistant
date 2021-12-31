import express from 'express'
import { inventoryController } from '../controllers/inventoryController.js'

export const inventoryRouter = express.Router()
const { getByItemAndLocation } = inventoryController()

inventoryRouter.get('/', getByItemAndLocation)
