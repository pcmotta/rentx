import auth from "@config/auth";
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
    sub: string,
    email: string
}

interface ITokenResponse {
    token: string
    refresh_token: string
}

@injectable()
class RefreshTokenUseCase {
    constructor(
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}

    async execute(token: string): Promise<ITokenResponse> {
        const { email, sub: user_id } = verify(token, auth.secret_refresh_token) as IPayload

        const userToken = await this.userTokenRepository.findByUserIdAndRefreshToken(
            user_id,
            token
        )

        if (!userToken) {
            throw new AppError('Refresh Token does not exists!')
        }

        await this.userTokenRepository.deleteById(userToken.id)

        const refresh_token = sign({ email }, auth.secret_refresh_token, {
            subject: user_id,
            expiresIn: auth.expires_in_refresh_token
        })

        await this.userTokenRepository.create({
            user_id,
            refresh_token,
            expires_date: this.dateProvider.addDays(auth.expires_refresh_token_days)
        })

        const newToken = sign({}, auth.secret_token, {
            subject: user_id,
            expiresIn: auth.expires_in_token
        })

        return {
            token: newToken,
            refresh_token
        }
    }
}

export { RefreshTokenUseCase }
