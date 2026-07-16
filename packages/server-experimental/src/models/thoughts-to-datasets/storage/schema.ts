import {
    index,
    pgTable,
    primaryKey,
    text,
    timestamp
} from "drizzle-orm/pg-core"
import { datasets } from "../../datasets/storage/schema"
import { thoughts } from "../../thoughts/storage/schema"

const thoughtsToDatasets = pgTable(
    "thoughts_to_datasets",
    {
        thoughtId: text()
            .notNull()
            .references(() => thoughts.id, { onDelete: "cascade" }),
        datasetId: text()
            .notNull()
            .references(() => datasets.id, { onDelete: "cascade" }),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow()
    },
    table => [
        primaryKey({ columns: [table.thoughtId, table.datasetId] }),
        index().on(table.datasetId)
    ]
)

type ThoughtToDataset = typeof thoughtsToDatasets.$inferSelect

export { type ThoughtToDataset, thoughtsToDatasets }
