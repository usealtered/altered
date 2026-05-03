import { getEnvironmentConfig } from "@altered/core-experimental/config/environment"
import { drizzle } from "drizzle-orm/node-postgres"
import { relations } from "./relations"
import { schema } from "./schema"

function createDatabase() {
    const {
        shared: {
            storage: { database }
        }
    } = getEnvironmentConfig()

    return drizzle({
        connection: { connectionString: database.url },
        schema,
        relations,
        casing: "snake_case"
    })
}

type Database = ReturnType<typeof createDatabase>

let database: Database | undefined

function getDatabase(): Database {
    database ??= createDatabase()

    return database
}

export { getDatabase }
