import { IUserResponseDTO } from '@modules/accounts/dtos/IUserResponseDTO'
import { User } from '@modules/accounts/infra/typeorm/entities/User'
import { UserMap } from '@modules/accounts/mapper/UserMap'
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository'
import { AppError } from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

@injectable()
class ProfileUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<IUserResponseDTO> {
        const user = await this.userRepository.findById(id)

        if (!user) {
            throw new AppError('User not found', 404)
        }

        return UserMap.toDTO(user)
    }
}

export { ProfileUserUseCase }
