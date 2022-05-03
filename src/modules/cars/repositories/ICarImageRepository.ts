import { CarImage } from "../infra/typeorm/entities/CarImage"

interface ICarImageRepository {
    create(car_id: string, image_name: string): Promise<CarImage>
    clean(car_id: string): Promise<void>
    findByCarId(car_id: string): Promise<CarImage[]>
}

export { ICarImageRepository }
