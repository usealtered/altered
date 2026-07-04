import type { Type } from "arktype"
import type { composeInstructions } from "../instructions/composition"

const TEXT_TEMPLATE_VARIABLE_OPEN_SEQUENCE_DEFAULT = "{{"
const TEXT_TEMPLATE_VARIABLE_CLOSE_SEQUENCE_DEFAULT = "}}"

const TEXT_TEMPLATE_WHITESPACE_SEQUENCES = [" ", "\n", "\r", "\t"] as const

type TextTemplateInterpolationConfig = {
    /**
     * @default "{{"
     */
    openSequence: string

    /**
     * @default "}}"
     */
    closeSequence: string
}

type TextTemplateValue = string | null

type TextTemplateValueSchema = Type & {
    inferOut: TextTemplateValue
}

type TextTemplateValueSchemaMap = Record<string, TextTemplateValueSchema>

type TextTemplateValueInputs<SchemaMap extends TextTemplateValueSchemaMap> = {
    [Key in keyof SchemaMap]: SchemaMap[Key] extends TextTemplateValueSchema
        ? SchemaMap[Key]["inferIn"]
        : never
}

type TextTemplateValueOutputs<SchemaMap extends TextTemplateValueSchemaMap> = {
    [Key in keyof SchemaMap]: SchemaMap[Key] extends TextTemplateValueSchema
        ? SchemaMap[Key]["inferOut"]
        : never
}

type TextTemplateWhitespaceResolutionMode = "collapse" | "pad" | "preserve"

type CreateTextTemplateParams<
    SchemaMap extends TextTemplateValueSchemaMap = TextTemplateValueSchemaMap
> = {
    template: string

    config?: {
        interpolation: TextTemplateInterpolationConfig
    }

    variables: {
        schemas: SchemaMap

        options?: {
            [Key in keyof SchemaMap]?: {
                whitespace?: TextTemplateWhitespaceResolutionMode
            }
        }
    }
}

type TextTemplate<SchemaMap extends TextTemplateValueSchemaMap> = {
    fill: (values: TextTemplateValueInputs<SchemaMap>) => string
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function normalizeTextTemplatePaddingWhitespace(whitespace: string): string {
    const lineBreakCount = whitespace.match(/\r\n|\r|\n/g)?.length ?? 0

    if (lineBreakCount >= 1) return "\n".repeat(Math.min(lineBreakCount, 2))

    return whitespace.length > 0 ? " " : ""
}

function createTextTemplateInterpolationPattern({
    interpolation
}: {
    interpolation: TextTemplateInterpolationConfig
}): RegExp {
    const { openSequence, closeSequence } = interpolation

    if (openSequence.length === 0 || closeSequence.length === 0)
        throw new Error(
            "The text template interpolation sequences cannot be empty."
        )

    const whitespaceSequences =
        TEXT_TEMPLATE_WHITESPACE_SEQUENCES.map(escapeRegExp).join("")

    /**
     * @remarks The first and last capture groups are for handling whitespace, and the middle group captures any non-empty text between the configured opening/closing sequences as the variable name.
     */
    return new RegExp(
        `([${whitespaceSequences}]*)${escapeRegExp(openSequence)}([\\s\\S]+?)${escapeRegExp(closeSequence)}([${whitespaceSequences}]*)`,
        "g"
    )
}

function extractTextTemplateVariableNames(
    template: string,
    interpolation: TextTemplateInterpolationConfig
): Set<string> {
    const variableNames = new Set<string>()

    const interpolationPattern = createTextTemplateInterpolationPattern({
        interpolation
    })

    for (const match of template.matchAll(interpolationPattern)) {
        const name = match[2]

        if (name) variableNames.add(name.trim())
    }

    return variableNames
}

function assertTextTemplateValuesSchemaMatchesTemplate({
    template,
    interpolation,
    schemas
}: {
    template: string
    interpolation: TextTemplateInterpolationConfig
    schemas: TextTemplateValueSchemaMap
}): void {
    const templateVariableNames = extractTextTemplateVariableNames(
        template,
        interpolation
    )

    const schemaMapKeys = Object.keys(schemas)

    const missingSchemaMapKeys = [...templateVariableNames].filter(
        variableName => !schemaMapKeys.includes(variableName)
    )

    const extraSchemaMapKeys = [...schemaMapKeys].filter(
        schemaKey => !templateVariableNames.has(schemaKey)
    )

    if (missingSchemaMapKeys.length === 0 && extraSchemaMapKeys.length === 0)
        return

    throw new Error(
        [
            "The text template schema keys must exactly match the template variable names.",
            missingSchemaMapKeys.length > 0
                ? `Missing schema keys: '${missingSchemaMapKeys.join("', '")}'.`
                : null,
            extraSchemaMapKeys.length > 0
                ? `Extra schema keys: '${extraSchemaMapKeys.join("', '")}'.`
                : null
        ]
            .filter(Boolean)
            .join(" ")
    )
}

function parseTextTemplateValues<SchemaMap extends TextTemplateValueSchemaMap>(
    values: TextTemplateValueInputs<SchemaMap>,
    schemas: SchemaMap
): TextTemplateValueOutputs<SchemaMap> {
    return Object.fromEntries(
        Object.entries(schemas).map(([key, value]) => {
            const parsedValue = value.assert(values[key])

            if (typeof parsedValue !== "string" && parsedValue !== null)
                throw new Error(
                    `Text template value '${key}' must resolve to either \`string\` or \`null\`.`
                )

            return [key, parsedValue]
        })
    ) as TextTemplateValueOutputs<SchemaMap>
}

/**
 * @deprecated Not worth the organizational overhead to maintain. Use {@link composeInstructions} instead and create a custom instruction composition function.
 *
 * @remarks Keep for reference until we have POC of Raycast instruction templating.
 */
function createTextTemplate<SchemaMap extends TextTemplateValueSchemaMap>({
    template,
    config,
    variables: { schemas, options }
}: CreateTextTemplateParams<SchemaMap>): TextTemplate<SchemaMap> {
    const { interpolation } = {
        ...config,

        interpolation: {
            openSequence:
                config?.interpolation?.openSequence ??
                TEXT_TEMPLATE_VARIABLE_OPEN_SEQUENCE_DEFAULT,
            closeSequence:
                config?.interpolation?.closeSequence ??
                TEXT_TEMPLATE_VARIABLE_CLOSE_SEQUENCE_DEFAULT
        }
    }

    assertTextTemplateValuesSchemaMatchesTemplate({
        template,
        interpolation,
        schemas
    })

    return {
        fill: values => {
            const parsedValues = parseTextTemplateValues(values, schemas)

            const interpolationPattern = createTextTemplateInterpolationPattern(
                {
                    interpolation
                }
            )

            return template
                .trim()
                .replace(
                    interpolationPattern,
                    (
                        _match,
                        whitespaceBefore: string,
                        variableName: string,
                        whitespaceAfter: string
                    ) => {
                        const normalizedVariableName = variableName.trim()

                        const value = parsedValues[normalizedVariableName]
                        if (value === undefined)
                            throw new Error(
                                `Text template value '${normalizedVariableName}' not found. This should never happen.`
                            )

                        const normalizedValue = value?.trim() ?? null

                        const whitespaceResolutionMode =
                            options?.[normalizedVariableName]?.whitespace ??
                            "preserve"

                        if (whitespaceResolutionMode === "collapse")
                            return normalizedValue ?? ""

                        if (whitespaceResolutionMode === "pad")
                            return normalizedValue === null
                                ? normalizeTextTemplatePaddingWhitespace(
                                      whitespaceBefore + whitespaceAfter
                                  )
                                : `${normalizeTextTemplatePaddingWhitespace(whitespaceBefore)}${normalizedValue}${normalizeTextTemplatePaddingWhitespace(whitespaceAfter)}`

                        return `${whitespaceBefore}${normalizedValue ?? ""}${whitespaceAfter}`
                    }
                )
        }
    }
}

export {
    type CreateTextTemplateParams,
    createTextTemplate,
    type TextTemplate,
    type TextTemplateValue,
    type TextTemplateValueSchemaMap,
    type TextTemplateWhitespaceResolutionMode
}
