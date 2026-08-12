import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorize } from "../middlewares/authorize.js";
import { USERS } from "../dtos/createUser.dto.js";
import { PhotosController } from "../controllers/photos.js";
import { uploadProductPhotos } from "../middlewares/uploadProductPhotos.js";

export const photosRouter = Router()

photosRouter.delete('/:id', authenticate, authorize(USERS.admin), PhotosController.delete)
photosRouter.patch('/:id', authenticate, authorize(USERS.admin), uploadProductPhotos.single('photos'), PhotosController.update)