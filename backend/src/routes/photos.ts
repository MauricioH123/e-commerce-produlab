import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { USERS } from "../dtos/createUser.dto.js";
import { PhotosController } from "../controllers/photos.js";

export const photosRouter = Router()

photosRouter.delete('/:id', authenticate, authorize(USERS.admin), PhotosController.delete)