#!/usr/bin/env tsx

import { parseArgs } from "node:util"
import { syncAssets } from "../src/sync-assets/sync"
import { watchSyncAssets } from "../src/sync-assets/watch"

const { values } = parseArgs({
    options: {
        config: {
            type: "string",
            short: "c",
            default: "sync-assets.config.ts"
        },
        watch: { type: "boolean", short: "w", default: false }
    }
})

if (values.watch) await watchSyncAssets({ configPath: values.config })
else await syncAssets({ clean: true, configPath: values.config })
