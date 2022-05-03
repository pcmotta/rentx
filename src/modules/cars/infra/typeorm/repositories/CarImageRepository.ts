import { ICarImageRepository } from "@modules/cars/repositories/ICarImageRepository";
import { getRepository, Repository } from "typeorm";
import { CarImage } from "../entities/CarImage";

class CarImageRepository implements ICarImageRepository {
    private repository: Repository<CarImage>

    constructor() {
        this.repository = getRepository(CarImage)
    }

    async create(car_id: string, image_name: string): Promise<CarImage> {
        const carImage = this.repository.create({
            car_id,
            image_name
        })

        await this.repository.save(carImage)

        return carImage
    }

    async clean(car_id: string): Promise<void> {
        const images = await this.repository.find({ car_id })

        if (images) {
            images.forEach(async image => await this.repository.delete(image.id))
        }
    }

    async findByCarId(car_id: string): Promise<CarImage[]> {
        const images = await this.repository.find({
            car_id
        })

        return images
    }
}

export { CarImageRepository }
