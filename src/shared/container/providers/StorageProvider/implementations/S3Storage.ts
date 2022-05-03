import { S3 } from 'aws-sdk'
import { resolve } from 'path'
import fs from 'fs'
import mime from 'mime'

import upload from '@config/upload'
import { IStorageProvider } from "../IStorageProvider"

class S3Storage implements IStorageProvider {
    private client: S3

    constructor () {
        this.client = new S3({
            region: process.env.AWS_BUCKET_REGION
        })
    }

    async save(file: string, folder: string): Promise<string> {
        const originalname = resolve(upload.tmpFolder, file)

        const fileContent = await fs.promises.readFile(originalname)

        await this.client.putObject({
            Bucket: `${process.env.AWS_BUCKET}/${folder}`,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType: mime.getType(originalname)
        }).promise()

        await fs.promises.unlink(originalname)

        return file
    }

    async delete(file: string, folder: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: `${process.env.AWS_BUCKET}/${folder}`,
            Key: file
        }).promise()
    }
}

export { S3Storage }
