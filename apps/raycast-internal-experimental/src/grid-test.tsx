import { Action, ActionPanel, Color, Grid, Icon } from "@raycast/api"
import { useState } from "react"

export default function Command() {
    const [columns, setColumns] = useState(5)
    const [isLoading, setIsLoading] = useState(true)
    return (
        <Grid
            columns={columns}
            inset={Grid.Inset.Large}
            isLoading={isLoading}
            searchBarAccessory={
                <Grid.Dropdown
                    onChange={newValue => {
                        setColumns(Number.parseInt(newValue, 10))
                        setIsLoading(false)
                    }}
                    storeValue
                    tooltip="Grid Item Size"
                >
                    <Grid.Dropdown.Item title="Large" value={"3"} />
                    <Grid.Dropdown.Item title="Medium" value={"5"} />
                    <Grid.Dropdown.Item title="Small" value={"8"} />
                </Grid.Dropdown>
            }
        >
            {!isLoading &&
                Object.entries(Icon).map(([name, icon]) => (
                    <Grid.Item
                        actions={
                            <ActionPanel>
                                <Action.CopyToClipboard content={icon} />
                            </ActionPanel>
                        }
                        content={{
                            value: {
                                source: icon,
                                tintColor: Color.PrimaryText
                            },
                            tooltip: name
                        }}
                        key={name}
                        subtitle={icon}
                        title={name}
                    />
                ))}
        </Grid>
    )
}
