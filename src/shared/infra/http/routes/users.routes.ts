import { Router } from "express"
import multer from "multer"
import uploadConfig from "@config/upload"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated"
import {
    CreateUserController
} from "@modules/accounts/useCases/createUser/CreateUserController"
import {
    UpdateUserAvatarController
} from "@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController"
import { ProfileUserController } from "@modules/accounts/useCases/profileUser/ProfileUserController"

const uploadAvatar = multer(uploadConfig)

const usersRoutes = Router()
const createUserController = new CreateUserController()
const updateUserAvatarController = new UpdateUserAvatarController()
const profileUserController = new ProfileUserController()

usersRoutes.get('/profile', ensureAuthenticated, profileUserController.handle)
usersRoutes.post('/', createUserController.handle)
usersRoutes.patch('/avatar',
    ensureAuthenticated,
    uploadAvatar.single('avatar'),
    updateUserAvatarController.handle
)

export { usersRoutes }
