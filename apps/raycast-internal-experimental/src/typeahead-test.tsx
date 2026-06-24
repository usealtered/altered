import { URLSearchParams } from "node:url"
import { Action, ActionPanel, List } from "@raycast/api"
import { useFetch } from "@raycast/utils"
import { useState } from "react"

// biome-ignore lint/style/useExportsLast: Init.
export default function Command() {
    const [searchText, setSearchText] = useState("")
    const { data, isLoading } = useFetch(
        "https://api.npms.io/v2/search?" +
            // send the search query to the API
            new URLSearchParams({
                q: searchText.length === 0 ? "@raycast/api" : searchText
            }),
        {
            parseResponse: parseFetchResponse
        }
    )

    return (
        <List
            isLoading={isLoading}
            onSearchTextChange={setSearchText}
            searchBarPlaceholder="Search npm packages…"
            throttle
        >
            <List.Section subtitle={`${data?.length}`} title="Results">
                {data?.map(searchResult => (
                    <SearchListItem
                        key={searchResult.name}
                        searchResult={searchResult}
                    />
                ))}
            </List.Section>
        </List>
    )
}

function SearchListItem({ searchResult }: { searchResult: SearchResult }) {
    return (
        <List.Item
            accessories={[{ text: searchResult.username }]}
            actions={
                <ActionPanel>
                    <ActionPanel.Section>
                        <Action.OpenInBrowser
                            title="Open in Browser"
                            url={searchResult.url}
                        />
                    </ActionPanel.Section>
                    <ActionPanel.Section>
                        <Action.CopyToClipboard
                            content={`npm install ${searchResult.name}`}
                            shortcut={{ modifiers: ["cmd"], key: "." }}
                            title="Copy Install Command"
                        />
                    </ActionPanel.Section>
                </ActionPanel>
            }
            subtitle={searchResult.description}
            title={searchResult.name}
        />
    )
}

/** Parse the response from the fetch query into something we can display */
async function parseFetchResponse(response: Response) {
    const json = (await response.json()) as
        | {
              results: {
                  package: {
                      name: string
                      description?: string
                      publisher?: { username: string }
                      links: { npm: string }
                  }
              }[]
          }
        | { code: string; message: string }

    if (!response.ok || "message" in json) {
        throw new Error("message" in json ? json.message : response.statusText)
    }

    return json.results.map(
        result =>
            ({
                name: result.package.name,
                description: result.package.description,
                username: result.package.publisher?.username,
                url: result.package.links.npm
            }) as SearchResult
    )
}

type SearchResult = {
    description?: string
    name: string
    url: string
    username?: string
}
