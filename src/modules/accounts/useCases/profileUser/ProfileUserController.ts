import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ProfileUserUseCase } from "./ProfileUserUseCase";

class ProfileUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user

        const useCase = container.resolve(ProfileUserUseCase)
        const user = await useCase.execute(id)

        return response.json(user)
    }
}

export { ProfileUserController }
