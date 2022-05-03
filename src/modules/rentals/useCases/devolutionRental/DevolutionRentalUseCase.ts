import { ICarRepository } from "@modules/cars/repositories/ICarRepository"
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental"
import { IRentalRepository } from "@modules/rentals/repositories/IRentalRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { AppError } from "@shared/errors/AppError"
import { inject, injectable } from "tsyringe"

interface IRequest {
    id: string
    user_id: string
}

@injectable()
class DevolutionRentalUseCase {
    private MINIMUM_DAILY = 1

    constructor(
        @inject('RentalRepository')
        private rentalRepository: IRentalRepository,
        @inject('CarRepository')
        private carRepository: ICarRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}

    async execute({ id, user_id }: IRequest ): Promise<Rental> {
        const rental = await this.rentalRepository.findById(id)

        if (!rental) {
            throw new AppError('Rental does not exist!')
        }

        const car = await this.carRepository.findById(rental.car_id)

        const now = this.dateProvider.dateNow()

        let daily = this.dateProvider.compareInDays(
            rental.start_date,
            now
        )

        if (daily <= 0) {
            daily = this.MINIMUM_DAILY
        }

        const delay = this.dateProvider.compareInDays(
            now,
            rental.expected_return_date
        )

        let total = daily * car.daily_rate
        if (delay > 0) {
            total += delay * car.fine_amount
        }

        rental.end_date = now
        rental.total = total

        await this.rentalRepository.create(rental)
        await this.carRepository.updateAvailable(car.id, true)

        return rental
    }
}

export { DevolutionRentalUseCase }
