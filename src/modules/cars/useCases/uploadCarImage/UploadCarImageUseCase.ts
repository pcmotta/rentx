import { ICarImageRepository } from "@modules/cars/repositories/ICarImageRepository"
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider"
import { deleteFile } from "@utils/file"
import { inject, injectable } from "tsyringe"

interface IRequest {
    car_id: string,
    images_name: string[]
}

@injectable()
class UploadCarImageUseCase {
    constructor(
        @inject('CarImageRepository')
        private carImageRepository: ICarImageRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) {}

    async execute({ car_id, images_name }: IRequest): Promise<void> {
        const images = await this.carImageRepository.findByCarId(car_id)

        if (images) {
            await this.carImageRepository.clean(car_id)
            images.forEach(image => deleteFile(`./tmp/cars/${image.image_name}`))
        }

        images_name.map(async image => {
            await this.carImageRepository.create(car_id, image)
            await this.storageProvider.save(image, 'cars')
        })
    }
}

export { UploadCarImageUseCase }
