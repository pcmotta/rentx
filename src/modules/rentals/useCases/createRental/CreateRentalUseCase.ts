import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO"
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental"
import { IRentalRepository } from "@modules/rentals/repositories/IRentalRepository"
import { AppError } from "@shared/errors/AppError"
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { inject, injectable } from "tsyringe"
import { ICarRepository } from "@modules/cars/repositories/ICarRepository"

@injectable()
class CreateRentalUseCase {
    constructor(
        @inject('RentalRepository')
        private rentalRepository: IRentalRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('CarRepository')
        private carRepository: ICarRepository
    ) {}

    async execute({ user_id, car_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
        const rentalOpenToCar = await this.rentalRepository.findOpenRentalByCar(car_id)

        if (rentalOpenToCar) {
            throw new AppError('Car is unavailable')
        }

        const rentalOpenToUser = await this.rentalRepository.findOpenRentalByUser(user_id)

        if (rentalOpenToUser) {
            throw new AppError('There is a rental open for this user')
        }

        const compare = this.dateProvider.compareInHours(
            this.dateProvider.dateNow(), expected_return_date)

        if (compare < 24) {
            throw new AppError('Invalid return time!')
        }

        const rental = await this.rentalRepository.create({
            user_id,
            car_id,
            expected_return_date
        })

        await this.carRepository.updateAvailable(car_id, false)

        return rental
    }
}

export { CreateRentalUseCase }
