import { Router } from "express"
import { AddressController } from "../controllers/address.js"

export const addresRouter = Router()

addresRouter.patch('/:id', AddressController.update)