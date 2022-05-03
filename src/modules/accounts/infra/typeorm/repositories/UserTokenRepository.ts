import { getRepository, Repository } from "typeorm"

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO"
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository"
import { UserToken } from "../entities/UserToken"

class UserTokenRepository implements IUserTokenRepository {
    private repository: Repository<UserToken>

    constructor () {
        this.repository = getRepository(UserToken)
    }

    async create({
        expires_date, refresh_token, user_id
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const userToken = this.repository.create({
            expires_date,
            refresh_token,
            user_id
        })

        await this.repository.save(userToken)

        return userToken
    }

    async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
        const userToken = await this.repository.findOne({
            user_id,
            refresh_token
        })

        return userToken
    }

    async findByRefreshToken(refresh_token: string): Promise<UserToken> {
        const userToken = await this.repository.findOne({
            refresh_token
        })

        return userToken
    }

    async deleteById(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}

export { UserTokenRepository }
