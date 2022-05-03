import { AppError } from "@shared/errors/AppError"
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO"
import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory"
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase"
import { AuthenticateUserUSeCase } from "@modules/accounts/useCases/AuthenticateUser/AuthenticateUserUseCase"
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository"
import { UserTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokenRepositoryInMemory"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"

let authenticateUserUseCase: AuthenticateUserUSeCase
let createUserUseCase: CreateUserUseCase
let userRepository: UserRepositoryInMemory
let userTokenRepository: IUserTokenRepository
let dateProvider: IDateProvider

describe('Authenticate User', () => {
    beforeEach(() => {
        userRepository = new UserRepositoryInMemory()
        userTokenRepository = new UserTokenRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        authenticateUserUseCase = new AuthenticateUserUSeCase(
            userRepository,
            userTokenRepository,
            dateProvider
        )
        createUserUseCase = new CreateUserUseCase(userRepository)
    })

    it('should be able to authenticate an user', async () => {
        const user: ICreateUserDTO = {
            driver_license: '123456',
            email: 'user@test.com',
            password: '1234',
            name: 'User Test'
        }

        await createUserUseCase.execute(user)

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(result).toHaveProperty('token')
        expect(result.user.name).toBe(user.name)
    })

    it('should not be able to authenticate an unknown user', async () => {
        await expect(async () => {
            await authenticateUserUseCase.execute({
                email: 'unknown@test.com',
                password: '1234'
            })
        }).rejects.toEqual(new AppError("Email or password incorrect!"))
    })

    it('should not be able to authenticate with incorrect password', async () => {
        const user: ICreateUserDTO = {
            driver_license: '9999',
            email: 'user2@test.com',
            password: '1234',
            name: 'User 2 Test'
        }

        await createUserUseCase.execute(user)

        await expect(async () => {
            await authenticateUserUseCase.execute({
                email: user.email,
                password: 'incorrecPassword'
            })
        }).rejects.toEqual(new AppError("Email or password incorrect!"))
    })
})
