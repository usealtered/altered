function createShortcutScriptCommand({
    icon,
    title,
    subtitle,

    url,

    author,
    authorUrl,
    description
}: {
    icon: string
    title: string
    subtitle: string

    url: string

    author: string
    authorUrl: string
    description: string
}) {
    return `
    
#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title ${title}
# @raycast.mode silent

# @raycast.icon ${icon}
# @raycast.packageName ${subtitle}

# @raycast.author ${author}
# @raycast.authorURL ${authorUrl}
# @raycast.description ${description}

/usr/bin/open ${url}

`.trim()
}

export { createShortcutScriptCommand }
