import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { Router } from "express";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController";
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController";
import { UploadCarImageController } from "@modules/cars/useCases/uploadCarImage/UploadCarImageController";

import uploadConfig from '@config/upload'
import multer from "multer";
import upload from "@config/upload";

const uploadImages = multer(uploadConfig)

const carsRoutes = Router()

const createCarControler = new CreateCarController()
const listAvailableCarsController = new ListAvailableCarsController()
const createCarSpecificationsController = new CreateCarSpecificationController()
const uploadCarImagesController = new UploadCarImageController()

carsRoutes.post('/', ensureAuthenticated, ensureAdmin, createCarControler.handle)
carsRoutes.get('/available', listAvailableCarsController.handle)
carsRoutes.post('/specifications/:id',
    ensureAuthenticated,
    ensureAdmin,
    createCarSpecificationsController.handle
)
carsRoutes.post('/images/:id',
    ensureAuthenticated,
    ensureAdmin,
    uploadImages.array('images'),
    uploadCarImagesController.handle
)

export { carsRoutes }
