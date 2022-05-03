import { CarRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory"
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let carRepository: CarRepositoryInMemory
let specificationRepository: SpecificationRepositoryInMemory

describe('Create Car Specification', () => {
    beforeEach(() => {
        carRepository = new CarRepositoryInMemory()
        specificationRepository = new SpecificationRepositoryInMemory()

        createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
            carRepository,
            specificationRepository
        )
    })

    it('should not be able to add a new specification to a non-existent car', async () => {
        const car_id = '1234'
        const specifications_id = ['54321']

        await expect(async () => {
            await createCarSpecificationUseCase.execute({ car_id, specifications_id })
        }).rejects.toEqual(new AppError('Car does not exists!'))
    })

    it('should be able to add a new specification to the car', async () => {
        const car = await carRepository.create({
            name: 'Name Car',
            description: 'Description Car',
            daily_rate: 1000,
            license_plate: 'ABC-1234',
            fine_amount: 20,
            brand: 'Brand',
            category_id: 'CategoryId'
        })

        const specification = await specificationRepository.create({
            description: 'Specification Description',
            name: 'Specification Name'
        })

        const specifications_id = [specification.id]

        const specificationsCar = await createCarSpecificationUseCase.execute({
            car_id: car.id,
            specifications_id
        })

        expect(specificationsCar).toHaveProperty('specifications')
        expect(specificationsCar.specifications.length).toBe(1)
    })
})
