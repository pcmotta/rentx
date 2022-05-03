import { container } from 'tsyringe'
import '@shared/container/providers'

import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository'
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository'
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository'
import {
    CategoryRepository
} from '@modules/cars/infra/typeorm/repositories/CategoryRepository'
import {
    SpecificationRepository
} from '@modules/cars/infra/typeorm/repositories/SpecificationRepository'
import {
    ISpecificationRepository
} from '@modules/cars/repositories/ISpecificationRepository'
import { ICarRepository } from '@modules/cars/repositories/ICarRepository'
import { CarRepository } from '@modules/cars/infra/typeorm/repositories/CarRepository'
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository'
import { CarImageRepository } from '@modules/cars/infra/typeorm/repositories/CarImageRepository'
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository'
import { RentalRepository } from '@modules/rentals/infra/typeorm/repositories/RentalRepository'
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository'
import { UserTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UserTokenRepository'

container.registerSingleton<ICategoryRepository>(
    'CategoryRepository',
    CategoryRepository
)

container.registerSingleton<ISpecificationRepository>(
    'SpecificationRepository',
    SpecificationRepository
)

container.registerSingleton<IUserRepository>(
    'UserRepository',
    UserRepository
)

container.registerSingleton<ICarRepository>(
    'CarRepository',
    CarRepository
)

container.registerSingleton<ISpecificationRepository>(
    'SpecificationRepository',
    SpecificationRepository
)

container.registerSingleton<ICarImageRepository>(
    'CarImageRepository',
    CarImageRepository
)

container.registerSingleton<IRentalRepository>(
    'RentalRepository',
    RentalRepository
)

container.registerSingleton<IUserTokenRepository>(
    'UserTokenRepository',
    UserTokenRepository
)
