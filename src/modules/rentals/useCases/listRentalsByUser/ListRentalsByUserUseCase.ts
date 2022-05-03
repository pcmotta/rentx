import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalRepository } from "@modules/rentals/repositories/IRentalRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ListRentalsByUserUseCase {
    constructor (
        @inject('RentalRepository')
        private rentalRepository: IRentalRepository
    ) {}

    async execute(user_id: string): Promise<Rental[]> {
        const rentalsByUser = await this.rentalRepository.findByUser(user_id)

        return rentalsByUser
    }
}

export { ListRentalsByUserUseCase }
