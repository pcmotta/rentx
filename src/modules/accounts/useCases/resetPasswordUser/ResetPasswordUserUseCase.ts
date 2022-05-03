import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

interface IRequest {
    token: string
    password: string
}

@injectable()
class ResetPasswordUserUseCase {
    constructor(
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('UserRepository')
        private userRepository: IUserRepository
    ) {}

    async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByRefreshToken(token)

        if (!userToken) {
            throw new AppError('Token Invalid!')
        }

        if (this.dateProvider.compareIfBefore(
            userToken.expires_date,
            this.dateProvider.dateNow())
        ) {
            throw new AppError('Token expired!')
        }

        const user = await this.userRepository.findById(userToken.user_id)
        user.password = await hash(password, 8)

        await this.userRepository.create(user)
        await this.userTokenRepository.deleteById(userToken.id)
    }
}

export { ResetPasswordUserUseCase }
