import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUserUseCase } from "./ResetPasswordUserUseCase";

class ResetPasswordUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { token } = request.query
        const { password } = request.body

        const useCase = container.resolve(ResetPasswordUserUseCase)

        await useCase.execute({
            token: token as string,
            password
        })
        return response.send()
    }
}

export { ResetPasswordUserController }
