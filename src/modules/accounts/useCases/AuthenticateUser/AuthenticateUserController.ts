import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUSeCase } from "./AuthenticateUserUseCase";

class AuthenticateUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body

        const authenticateUserUseCase = container.resolve(AuthenticateUserUSeCase)

        const token = await authenticateUserUseCase.execute({ email, password })

        return response.json(token)
    }
}

export { AuthenticateUserController }
