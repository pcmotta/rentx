import { container } from "tsyringe"
import { LocalStorage } from "./implementations/LocalStorage"
import { S3Storage } from "./implementations/S3Storage"
import { IStorageProvider } from "./IStorageProvider"

const diskStorage = {
    local: LocalStorage,
    s3: S3Storage
}

container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    diskStorage[process.env.DISK]
)
