import { AppError } from "@shared/errors/AppError"
import {
    CategoryRepositoryInMemory
} from "@modules/cars/repositories/in-memory/CategoryRepositoryInMemory"
import { CreateCategoryUseCase } from "./CreateCategoryUseCase"

let createCategoryUseCase: CreateCategoryUseCase
let categoryRepository: CategoryRepositoryInMemory

describe('Create Category', () => {
    beforeEach(() => {
        categoryRepository = new CategoryRepositoryInMemory()
        createCategoryUseCase = new CreateCategoryUseCase(categoryRepository)
    })

    it('should be able to create a new category', async () => {
        const category = {
            name: 'Category Test',
            description: 'Category Description Test'
        }

        await createCategoryUseCase.execute(category)

        const categoryCreated = await categoryRepository.findByName(category.name)

        expect(categoryCreated).toHaveProperty('id')
    })

    it('should not be able to create a new category with same name', async () => {
        const category = {
            name: 'Category Test',
            description: 'Category Description Test'
        }

        await createCategoryUseCase.execute(category)

        await expect(async () => {
            await createCategoryUseCase.execute(category)
        }).rejects.toEqual(new AppError('Category Already Exists!'))
    })
})
