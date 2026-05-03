function constructPrompts(
    prompts: string[],
    options?: { delimiter?: string }
): string {
    const { delimiter = "\n\n" } = options ?? {}

    return prompts.join(delimiter)
}

export { constructPrompts }
