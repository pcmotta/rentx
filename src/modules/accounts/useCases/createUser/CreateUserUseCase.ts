import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";

@injectable()
class CreateUserUseCase {

    constructor(
        @inject('UserRepository') private usersRepository: IUserRepository
    ) {}

    async execute({ name, password, email, driver_license }: ICreateUserDTO):
        Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email)

        if (userAlreadyExists) {
            throw new AppError('User Already Exists')
        }

        const passwordHash = await hash(password, 8)

        await this.usersRepository.create({
            name,
            password: passwordHash,
            email,
            driver_license
        })
    }
}

export { CreateUserUseCase }
