import { inject, injectable } from "tsyringe"
import { UserRepository } from "@modules/accounts/infra/typeorm/repositories/UserRepository"
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider"

interface IRequest {
    user_id: string
    avatar_file: string
}

@injectable()
class UpdateUserAvatarUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: UserRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) {}

    async execute({ user_id, avatar_file }: IRequest): Promise<void> {
        const user = await this.userRepository.findById(user_id)

        if (user.avatar) {
            await this.storageProvider.delete(user.avatar, 'avatar')
        }

        await this.storageProvider.save(avatar_file, 'avatar')

        user.avatar = avatar_file

        await this.userRepository.create(user)
    }
}

export { UpdateUserAvatarUseCase }
