import { CarRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

let listAvailableCarsUseCase: ListAvailableCarsUseCase
let carRepository: CarRepositoryInMemory

describe('List Cars', () => {

    beforeEach(() => {
        carRepository = new CarRepositoryInMemory()
        listAvailableCarsUseCase = new ListAvailableCarsUseCase(carRepository)
    })

    it('should be able to list all available cars', async () => {
        const car = await carRepository.create({
            name: 'Car1',
            description: 'Car1 Description',
            daily_rate: 150,
            license_plate: 'ABC-1234',
            fine_amount: 50,
            brand: 'Fiat',
            category_id: 'Category'
        })

        const cars = await listAvailableCarsUseCase.execute({})

        expect(cars).toEqual([car])
    })

    it('should be able to list all available cars by name', async () => {
        const car = await carRepository.create({
            name: 'Car2',
            description: 'Car2 Description',
            daily_rate: 150,
            license_plate: 'DEF-1234',
            fine_amount: 50,
            brand: 'Fiat Test Name',
            category_id: 'Category Test Name'
        })

        const cars = await listAvailableCarsUseCase.execute({
            name: 'Car2'
        })

        expect(cars).toEqual([car])
    })

    it('should be able to list all available cars by brand', async () => {
        const car = await carRepository.create({
            name: 'Car3',
            description: 'Car3 Description',
            daily_rate: 150,
            license_plate: 'GHI-1234',
            fine_amount: 50,
            brand: 'Fiat Test Brand',
            category_id: 'Category Test Brand'
        })

        const cars = await listAvailableCarsUseCase.execute({
            brand: 'Fiat Test Brand'
        })

        expect(cars).toEqual([car])
    })

    it('should be able to list all available cars by category_id', async () => {
        const car = await carRepository.create({
            name: 'Car4',
            description: 'Car4 Description',
            daily_rate: 150,
            license_plate: 'JKL-1234',
            fine_amount: 50,
            brand: 'Fiat Test Category',
            category_id: 'Category Test Category'
        })

        const cars = await listAvailableCarsUseCase.execute({
            category_id: 'Category Test Category'
        })

        expect(cars).toEqual([car])
    })
})
