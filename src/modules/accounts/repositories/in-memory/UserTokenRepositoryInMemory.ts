import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserToken } from "@modules/accounts/infra/typeorm/entities/UserToken";
import { IUserTokenRepository } from "../IUserTokenRepository";

class UserTokenRepositoryInMemory implements IUserTokenRepository {
    usersTokens: UserToken[] = []

    async create({ expires_date, refresh_token, user_id }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = new UserToken()

        Object.assign(userToken, {
            expires_date,
            refresh_token,
            user_id,
            created_at: new Date()
        })

        this.usersTokens.push(userToken)

        return userToken
    }

    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
        const userToken = this.usersTokens.find(userToken =>
            userToken.user_id === user_id && userToken.refresh_token === refresh_token)

        return userToken
    }

    async findByRefreshToken(refresh_token: string): Promise<UserToken> {
        const userToken = this.usersTokens.find(userToken =>
            userToken.refresh_token === refresh_token)

        return userToken
    }

    async deleteById(id: string): Promise<void> {
        const userToken = this.usersTokens.find(userToken =>
            userToken.id === id)

        this.usersTokens.splice(this.usersTokens.indexOf(userToken))
    }
}

export { UserTokenRepositoryInMemory }
