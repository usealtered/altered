import { Action, ActionPanel, Detail, Icon, List } from "@raycast/api"

export default function Command() {
    return (
        <List>
            <List.Item
                actions={
                    <ActionPanel>
                        <Action.Push
                            target={<Detail markdown="# Hey! 👋" />}
                            title="Show Details"
                        />
                    </ActionPanel>
                }
                icon={Icon.Bird}
                title="Greeting"
            />
        </List>
    )
}
