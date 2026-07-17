import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({
    path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env")
})

/**
 * @todo P3: Fix and use `getEnvironmentConfig` (apparently Node can't resolve nested `@altered/core-experimental/...` via `./*` exports).
 */
const url = process.env.SHARED_STORAGE_DATABASE_URL

if (!url)
    throw new Error("SHARED_STORAGE_DATABASE_URL is required for drizzle-kit.")

export default defineConfig({
    schema: "./src/**/schema.ts",
    dialect: "postgresql",

    dbCredentials: { url },
    casing: "snake_case"
})
