import { ICreateRentalDTO } from "@modules/rentals/dtos/ICreateRentalDTO";
import { IRentalRepository } from "@modules/rentals/repositories/IRentalRepository";
import { getRepository, Repository } from "typeorm";
import { Rental } from "../entities/Rental";

class RentalRepository implements IRentalRepository {
    private repository: Repository<Rental>

    constructor() {
        this.repository = getRepository(Rental)
    }

    async findOpenRentalByCar(car_id: string): Promise<Rental> {
        const rentalQuery = await this.repository
            .createQueryBuilder('r')
            .where('r.car_id = :car_id', { car_id })
            .andWhere('r.end_date is null')

        const rental = await rentalQuery.getRawOne()

        return rental
    }

    async findOpenRentalByUser(user_id: string): Promise<Rental> {
        const rental = this.repository.findOne({
            where: {
                user_id,
                end_date: null
            }
        })

        return rental
    }

    async findByUser(user_id: string): Promise<Rental[]> {
        const rentals = this.repository.find({
            where: {
                user_id
            },
            relations: ['car']
        })

        ;(await rentals).forEach(rental => {
            delete rental.car_id
            delete rental.user_id
        })

        return rentals
    }

    async create({ car_id, user_id, expected_return_date, id, end_date, total }: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create({
            car_id,
            user_id,
            expected_return_date,
            id,
            end_date,
            total
        })

        await this.repository.save(rental)

        return rental
    }

    async findById(id: string): Promise<Rental> {
        const rental = await this.repository.findOne(id)

        return rental
    }
}

export { RentalRepository }
