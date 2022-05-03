import { ResetPasswordUserController } from '@modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController'
import { SendForgotPasswordMailController } from '@modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController'
import { Router } from 'express'

const routes = Router()

const sendForgotPasswordController = new SendForgotPasswordMailController()
const resetPasswordUserController = new ResetPasswordUserController()

routes.post('/forgot', sendForgotPasswordController.handle)
routes.post('/reset', resetPasswordUserController.handle)

export { routes as passwordRoutes }
