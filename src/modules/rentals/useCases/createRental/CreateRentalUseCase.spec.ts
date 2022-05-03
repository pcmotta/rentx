import { ICarRepository } from "@modules/cars/repositories/ICarRepository"
import { CarRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarRepositoryInMemory"
import { RentalRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalRepositoryInMemory"
import { IRentalRepository } from "@modules/rentals/repositories/IRentalRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"
import { AppError } from "@shared/errors/AppError"
import dayjs from "dayjs"
import { CreateRentalUseCase } from "./CreateRentalUseCase"

let carRepository: ICarRepository
let rentalRepository: IRentalRepository
let createRentalUseCase: CreateRentalUseCase
let dateProvider: IDateProvider

describe('Create Rental', () => {
    const tomorrow = dayjs().add(1, 'day').toDate()

    beforeEach(() => {
        carRepository = new CarRepositoryInMemory()
        rentalRepository = new RentalRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        createRentalUseCase = new CreateRentalUseCase(rentalRepository, dateProvider, carRepository)
    })

    it('it should be able to create a new rental', async () => {
        const car = await carRepository.create({
            brand: 'Fiat',
            category_id: '123',
            daily_rate: 100,
            description: 'Description',
            fine_amount: 50,
            license_plate: 'KVM-3545',
            name: 'Fiat Uno'
        })

        expect(car).toHaveProperty('id')
        expect(car.available).toEqual(true)

        const rental = await createRentalUseCase.execute({
            user_id: '123',
            car_id: car.id,
            expected_return_date: tomorrow
        })

        const carAfterRental = await carRepository.findById(car.id)

        expect(rental).toHaveProperty('id')
        expect(rental).toHaveProperty('start_date')
        expect(carAfterRental.available).toEqual(false)
    })

    it(`should not be able to create a new rental
        if there is another open rental to the same user`, async () => {
        const car = await carRepository.create({
            name: 'Fiat Uno',
            brand: 'Fiat',
            category_id: '123',
            daily_rate: 100,
            description: 'Compacto',
            fine_amount: 20,
            license_plate: 'KVM-3545'
        })

        const newCar = await carRepository.create({
            name: 'Fiat Uno',
            brand: 'Fiat',
            category_id: '123',
            daily_rate: 100,
            description: 'Compacto',
            fine_amount: 20,
            license_plate: 'KVM-3545'
        })

        await createRentalUseCase.execute({
            user_id: '123',
            car_id: car.id,
            expected_return_date: tomorrow
        })

        await expect(async () => {
            await createRentalUseCase.execute({
                user_id: '123',
                car_id: newCar.id,
                expected_return_date: tomorrow
            })
        }).rejects.toEqual(new AppError('There is a rental open for this user'))
    })

    it(`should not be able to create a new rental
        if there is another open rental to the same car`, async () => {
        const car = await carRepository.create({
            name: 'Fiat Uno',
            brand: 'Fiat',
            category_id: '123',
            daily_rate: 100,
            description: 'Compacto',
            fine_amount: 20,
            license_plate: 'KVM-3545'
        })

        await createRentalUseCase.execute({
            user_id: '123',
            car_id: car.id,
            expected_return_date: tomorrow
        })

        await expect(async () => {
            await createRentalUseCase.execute({
                user_id: '456',
                car_id: car.id,
                expected_return_date: tomorrow
            })
        }).rejects.toEqual(new AppError('Car is unavailable'))
    })

    it(`should not be able to create a new rental with invalid return time`, async () => {
        await expect(async () => {
            await createRentalUseCase.execute({
                user_id: '123',
                car_id: '345',
                expected_return_date: new Date()
            })
        }).rejects.toEqual(new AppError('Invalid return time!'))
    })
})
