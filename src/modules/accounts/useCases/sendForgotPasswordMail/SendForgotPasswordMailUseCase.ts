import { v4 } from "uuid";
import { inject, injectable } from "tsyringe";
import { resolve } from 'path'

import { IUserRepository } from "@modules/accounts/repositories/IUserRepository";
import { IUserTokenRepository } from "@modules/accounts/repositories/IUserTokenRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,
        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('MailProvider')
        private mailProvider: IMailProvider
    ) { }

    async execute(email: string) {
        const user = await this.userRepository.findByEmail(email)
        const templatePath = resolve(
            __dirname,
            '..',
            '..',
            'views',
            'emails',
            'forgotPassword.hbs'
        )

        if (!user) {
            throw new AppError('User does not exists!')
        }

        const token = v4()

        await this.userTokenRepository.create({
            user_id: user.id,
            refresh_token: token,
            expires_date: this.dateProvider.addHours(3)
        })

        const variables = {
            name: user.name,
            link: `${process.env.FORGOT_MAIL_URL}${token}`
        }

        await this.mailProvider.sendMail(
            email,
            'Recuperação de Senha',
            variables,
            templatePath
        )
    }
}

export { SendForgotPasswordMailUseCase }
