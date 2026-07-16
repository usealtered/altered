import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

/**
 * @todo P2: This should probably instead be some sort of dynamic versioning row or integration with our VCS/authoring system (per thought-row first), so once we deconstruct validation/authoring/drafts/etc we can migrate this. Until then, it can live.
 */
const THOUGHT_GRADES = ["raw", "derived", "manual"] as const

type ThoughtGrade = (typeof THOUGHT_GRADES)[number]

const thoughts = pgTable(
    "thoughts",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        /**
         * @todo P1: Consider if we can migrate this to a Dataset once our Raycast commit is merged.
         */
        brainId: text(),

        alias: text(),
        content: text(),

        /**
         * @remarks See {@link THOUGHT_GRADES}.
         */
        grade: text({ enum: THOUGHT_GRADES }).$type<ThoughtGrade>().notNull(),

        /**
         * @todo P2: This should be migrated to a proper authoring system.
         */
        isAiAuthored: boolean().notNull().default(false),

        /**
         * @todo P2: This should be migrated to a proper authoring system.
         */
        isSystem: boolean().notNull().default(false),

        /**
         * The date the thought was initially created.
         *
         * @remarks This can be set for uploaded thoughts.
         */
        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

        /**
         * The date the thought was added to the database.
         *
         * @remarks Intended to be immutable.
         */
        addedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),

        /**
         * The date the thought was last updated.
         */
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date())
    },
    table => [
        index().on(table.brainId, table.createdAt),
        index().on(table.grade),
        index().on(table.isSystem)
    ]
)

type Thought = typeof thoughts.$inferSelect

export { THOUGHT_GRADES, type Thought, type ThoughtGrade, thoughts }
