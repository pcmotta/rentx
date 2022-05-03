import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO"
import { Car } from "@modules/cars/infra/typeorm/entities/Car"
import { ICarRepository } from "@modules/cars/repositories/ICarRepository"

class CarRepositoryInMemory implements ICarRepository {
    cars: Car[] = []

    async create({ name, description, license_plate, daily_rate, fine_amount,
        brand, category_id, specifications }: ICreateCarDTO): Promise<Car> {
        const car = new Car()

        Object.assign(car, {
            name,
            description,
            license_plate,
            daily_rate,
            fine_amount,
            brand,
            category: {
                id: category_id
            },
            specifications
        })

        this.cars.push(car)

        return car
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.cars.find(car => car.license_plate === license_plate)
    }

    async findAvailable(name?: string, brand?: string, category_id?: string): Promise<Car[]> {
        const cars = this.cars
            .filter(car => car.available === true)
            .filter(car => (!name || car.name === name) && (!brand || car.brand === brand) &&
                (!category_id || car.category.id === category_id))

        return cars
    }

    async findById(id: string): Promise<Car> {
        const car = this.cars.find(car => id === car.id)

        return car
    }

    async updateAvailable(id: string, available: boolean): Promise<void> {
        const car = this.cars.find(car => car.id === id)
        car.available = available
    }
}

export { CarRepositoryInMemory }
