import {
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"
import { conversations } from "../../../chat/conversations/schema"
import { chatMessages } from "../../../chat/messages/schema"
import { thoughts } from "../../thoughts/storage/schema"

/**
 * @todo P2: Consider consolidating these details into builtin attributes, or if we should keep high-volume rows as independent primitives.
 */
const AGENT_RUN_TYPES = ["distillation", "query"] as const

/**
 * @todo P2: Consider consolidating these details into builtin attributes, or if we should keep high-volume rows as independent primitives.
 */
const AGENT_RUN_STATUSES = [
    "pending",
    "running",
    "succeeded",
    "failed"
] as const

type AgentRunType = (typeof AGENT_RUN_TYPES)[number]
type AgentRunStatus = (typeof AGENT_RUN_STATUSES)[number]

const agentRuns = pgTable(
    "agent_runs",
    {
        id: text().primaryKey().notNull().$defaultFn(nanoid),

        type: text({ enum: AGENT_RUN_TYPES }).$type<AgentRunType>().notNull(),
        status: text({ enum: AGENT_RUN_STATUSES })
            .$type<AgentRunStatus>()
            .notNull()
            .default("pending"),

        /**
         * @todo P2: We should type this.
         */
        model: text().notNull(),

        /**
         * @todo P2: Consider consolidating as an attribute.
         */
        inputTokens: integer(),

        /**
         * @todo P2: Consider consolidating as an attribute.
         */
        outputTokens: integer(),

        /**
         * @todo P2: Consider consolidating as an attribute.
         */
        totalTokens: integer(),

        /**
         * Decimal cost in USD, stored as text to avoid float drift.
         */
        cost: text(),

        /**
         * Groups batched runs (e.g. conversation reindex) so they stay distinguishable from single-message runs.
         */
        batchId: text(),

        /**
         * @remarks Not sure what the purpose of this is, but our future implementation may reveal it.
         */
        conversationId: text().references(() => conversations.id, {
            onDelete: "set null"
        }),

        /**
         * @remarks Not sure what the purpose of this is, but our future implementation may reveal it.
         */
        chatMessageId: text().references(() => chatMessages.id, {
            onDelete: "set null"
        }),

        /**
         * @remarks If this is for the distilled thought, it should probably be multiple, since a single run will likely call multiple tools and aggregate the cost as a whole. Individual tool call cost is possible but it leaves out the cost of intermediary steps like context loading and thinking. We need to group by measurable run (depends on our agent composition, which we can use to refine this later).
         *
         * EDIT: This is different than `resultThoughtIds`, I'm not sure what this is for.
         */
        thoughtId: text().references(() => thoughts.id, {
            onDelete: "set null"
        }),

        /**
         * Thought ids produced (distillation) or returned (query).
         *
         * @todo P2: Use this as memoryQueryId omission set for subsequent queries in the same conversation.
         *
         * @remarks Not sure what the above TODO means. But this should likely be an actual 'many' ID relation to thoughts, and it should be typed with the branded Thought ID (when implemented). For now - fine.
         */
        resultThoughtIds: jsonb().$type<string[]>().notNull().default([]),

        /**
         * @remarks Nullable error message? Should we instead relate this to a database log entry? ...are database log entries even valid, or should that be an OTEL implementation? (seek AI council)
         */
        error: text(),

        createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp({ withTimezone: true })
            .notNull()
            .defaultNow()
            .$onUpdateFn(() => new Date()),

        completedAt: timestamp({ withTimezone: true })
    },
    table => [
        index().on(table.type, table.createdAt),
        index().on(table.batchId),
        index().on(table.conversationId),
        index().on(table.chatMessageId),
        index().on(table.status)
    ]
)

type AgentRun = typeof agentRuns.$inferSelect

export {
    AGENT_RUN_STATUSES,
    AGENT_RUN_TYPES,
    type AgentRun,
    type AgentRunStatus,
    type AgentRunType,
    agentRuns
}
