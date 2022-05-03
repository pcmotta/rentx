import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { inject, injectable } from "tsyringe"
import { AppError } from "@shared/errors/AppError"
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository"
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository"
import auth from "@config/auth"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"

interface IRequest {
    email: string
    password: string
}

interface IResponse {
    user: {
        name: string
        email: string
    }
    token: string,
    refresh_token: string
}

@injectable()
class AuthenticateUserUSeCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.userRepository.findByEmail(email)
        const {
            secret_token,
            secret_refresh_token,
            expires_in_token,
            expires_in_refresh_token,
            expires_refresh_token_days
        } = auth

        if (!user) {
            throw new AppError('Email or password incorrect!')
        }

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError('Email or password incorrect!')
        }

        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token
        })

        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token
        })

        await this.userTokenRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date: this.dateProvider.addDays(expires_refresh_token_days)
        })

        return {
            user: {
                name: user.name,
                email: user.email
            },
            token,
            refresh_token
        }
    }
}

export { AuthenticateUserUSeCase }
