function toTitleCase<String extends string>(
    string: String
): Capitalize<String> {
    return (string.charAt(0).toUpperCase() +
        string.slice(1)) as Capitalize<String>
}

export { toTitleCase }
