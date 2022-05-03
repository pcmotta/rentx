import { Request, Response } from "express";
import { container } from "tsyringe";
import { validate } from 'uuid'

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

class ListAvailableCarsController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { name, brand, category_id } = request.query
        const listAvailableCarsUseCase = container.resolve(ListAvailableCarsUseCase)

        if (category_id && !validate(category_id.toString())) {
            return response.status(400).json({
                error: 'category_id is not an uuid'
            })
        }

        const cars = await listAvailableCarsUseCase.execute({
            name: name as string,
            brand: brand as string,
            category_id: category_id as string
        })

        return response.json(cars)
    }
}

export { ListAvailableCarsController }
