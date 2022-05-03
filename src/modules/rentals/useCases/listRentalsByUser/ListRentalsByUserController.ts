import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListRentalsByUserUseCase } from "./ListRentalsByUserUseCase";

class ListRentalsByUserController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: user_id } = request.user

        const useCase = container.resolve(ListRentalsByUserUseCase)

        const rentals = await useCase.execute(user_id)

        return response.json(rentals)
    }
}

export { ListRentalsByUserController }
