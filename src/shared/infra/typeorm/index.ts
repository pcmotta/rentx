import { Connection, createConnection, getConnectionOptions } from 'typeorm'

interface IOptions {
    host: string
}

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions()
    const test = process.env.NODE_ENV === 'test'

    return createConnection(
        Object.assign(defaultOptions, {
            database: test ?
                'rentx_test' : defaultOptions.database
        })
    )
}
