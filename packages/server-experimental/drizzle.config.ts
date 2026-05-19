import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { getEnvironmentConfig } from "@altered/core-experimental/config/environment/definitions"
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env")
})

const {
    shared: {
        storage: { database }
    }
} = getEnvironmentConfig()

export default defineConfig({
    schema: "./src/**/schema.ts",
    dialect: "postgresql",

    dbCredentials: { url: database.url },
    casing: "snake_case"
})
