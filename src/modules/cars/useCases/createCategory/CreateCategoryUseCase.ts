import { inject, injectable } from "tsyringe"
import { AppError } from "@shared/errors/AppError"
import { ICategoryRepository } from "@modules/cars/repositories/ICategoryRepository"

interface IRequest {
    name: string
    description: string
}

@injectable()
class CreateCategoryUseCase {
    constructor(
        @inject('CategoryRepository')
        private categoryRepository: ICategoryRepository
    ) {}

    async execute({ name, description }: IRequest): Promise<void> {
        const categoryAlreadyExists = await this.categoryRepository.findByName(name)

        if (categoryAlreadyExists) {
            throw new AppError('Category Already Exists!')
        }

        await this.categoryRepository.create({ name, description })
    }
}

export { CreateCategoryUseCase }
