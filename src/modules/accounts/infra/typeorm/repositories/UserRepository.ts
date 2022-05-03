import { getRepository, Repository } from "typeorm"
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO"
import { User } from "@modules/accounts/infra/typeorm/entities/User"
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository"

class UserRepository implements IUserRepository {
    private repository: Repository<User>

    constructor() {
        this.repository = getRepository(User)
    }

    async create({ name, password, email, driver_license, id, avatar }: ICreateUserDTO):
        Promise<void> {
        const user = await this.repository.create({
            name,
            password,
            email,
            driver_license,
            id,
            avatar
        })

        await this.repository.save(user)
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ email })

        return user
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne(id)

        return user
    }
}

export { UserRepository }
