import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";

class UserRepositoryInMemory implements IUserRepository {
    users: User[] = []

    async create({ name, email, password, driver_license }: ICreateUserDTO): Promise<void> {
        const user = new User()

        Object.assign(user, {
            name,
            email,
            password,
            driver_license
        })

        this.users.push(user)
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.users.find(user => user.email === email)

        return user
    }

    async findById(id: string): Promise<User> {
        const user = this.users.find(user => user.id === id)

        return user
    }

}

export { UserRepositoryInMemory }
