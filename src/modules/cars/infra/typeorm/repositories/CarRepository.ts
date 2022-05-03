import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarRepository } from "@modules/cars/repositories/ICarRepository";
import { getRepository, Repository } from "typeorm";
import { Car } from "../entities/Car";

class CarRepository implements ICarRepository {

    private repository: Repository<Car>

    constructor() {
        this.repository = getRepository(Car)
    }

    async create({ id, brand, category_id, daily_rate, description, fine_amount,
        license_plate, name, specifications }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            id,
            brand,
            category: {
                id: category_id
            },
            daily_rate,
            description,
            fine_amount,
            license_plate,
            name,
            specifications
        })

        await this.repository.save(car)

        return car
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        const car = await this.repository.findOne({
            license_plate
        })

        return car
    }

    async findAvailable(name?: string, brand?: string, category_id?: string): Promise<Car[]> {
        const carsQuery = await this.repository
            .createQueryBuilder('c')
            .where('c.available = :available', { available: true })

        if (name) {
            carsQuery.andWhere('c.name = :name', { name })
        }

        if (brand) {
            carsQuery.andWhere('c.brand = :brand', { brand })
        }

        if (category_id) {
            carsQuery.andWhere('c.category_id = :category_id', { category_id })
        }

        const cars = await carsQuery.getMany()

        return cars
    }

    async findById(id: string): Promise<Car> {
        const car = await this.repository.findOne(id)

        return car
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        await this.repository.createQueryBuilder()
            .update()
            .set({ available })
            .where('id = :id')
            .setParameters({ id })
            .execute()
    }
}

export { CarRepository }
