import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarRepository } from "@modules/cars/repositories/ICarRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateCarUseCase {

    constructor(
        @inject('CarRepository')
        private carRepository: ICarRepository
    ) {}

    async execute({ name, description, daily_rate, license_plate,
        fine_amount, brand, category_id }: ICreateCarDTO): Promise<Car> {
        const carAlreadyExists = await this.carRepository.findByLicensePlate(license_plate)

        if (carAlreadyExists) {
            throw new AppError('Car Already Exists!')
        }

        const car = await this.carRepository.create({
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id
        })

        return car
    }
}

export { CreateCarUseCase }
