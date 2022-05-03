import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarRepository } from "@modules/cars/repositories/ICarRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
    category_id?: string
    name?: string
    brand?: string
}

@injectable()
class ListAvailableCarsUseCase {
    constructor(
        @inject('CarRepository')
        private carRepository: ICarRepository
    ) {}

    async execute({ name, brand, category_id }: IRequest): Promise<Car[]> {
        const cars = await this.carRepository.findAvailable(name, brand, category_id)

        return cars
    }
}

export { ListAvailableCarsUseCase }
