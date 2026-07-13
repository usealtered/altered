type KebabToSnakeCase<String extends string> =
    String extends `${infer Prefix}-${infer Suffix}`
        ? `${Prefix}_${KebabToSnakeCase<Suffix>}`
        : String

export type { KebabToSnakeCase }
