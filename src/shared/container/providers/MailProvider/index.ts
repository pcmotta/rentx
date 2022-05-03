import { container } from "tsyringe"

import { IMailProvider } from "./IMailProvider"
import { EtherealMailProvider } from "./implementations/EtherealMailProvider"
import { SesMailProvider } from "./implementations/SesMailProvider"

const mailProvider = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SesMailProvider)
}

container.registerInstance<IMailProvider>(
    'MailProvider',
    mailProvider[process.env.MAIL]
)
