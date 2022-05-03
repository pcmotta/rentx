import { UserRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserRepositoryInMemory"
import { UserTokenRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserTokenRepositoryInMemory"
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository"
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider"
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemory"
import { AppError } from "@shared/errors/AppError"
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase"

let useCase: SendForgotPasswordMailUseCase
let userRepository: IUserRepository
let userTokenRepository: IUserTokenRepository
let dateProvider: IDateProvider
let mailProvider: IMailProvider

describe('Send forgot Mail', () => {
    beforeEach(() => {
        userRepository = new UserRepositoryInMemory()
        userTokenRepository = new UserTokenRepositoryInMemory()
        dateProvider = new DayjsDateProvider()
        mailProvider = new MailProviderInMemory()

        useCase = new SendForgotPasswordMailUseCase(
            userRepository,
            userTokenRepository,
            dateProvider,
            mailProvider
        )
    })

    it('should be able to send a forgot password mail to user', async () => {
        const sendMail = jest.spyOn(mailProvider, 'sendMail')
        const email = 'teste@test.com'

        await userRepository.create({
            name: 'Teste',
            email,
            driver_license: 'KVM-3545',
            password: '123456'
        })

        await useCase.execute(email)

        expect(sendMail).toHaveBeenCalled()
    })

    it('should not be able to send an email if user does not exists!', () => {
        expect(async () => {
            useCase.execute('tst@tst.com')
        }).rejects.toEqual(new AppError('User does not exists!'))
    })

    it('should be able to create an users token', async () => {
        const generateTokenMail = jest.spyOn(userTokenRepository, 'create')
        const email = 'teste2@test.com'

        await userRepository.create({
            name: 'Teste',
            email,
            driver_license: 'KVM-3545',
            password: '123456'
        })

        await useCase.execute(email)

        expect(generateTokenMail).toBeCalled()
    })
})
