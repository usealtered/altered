import {
    Action,
    ActionPanel,
    Icon,
    showHUD,
    showToast,
    Toast
} from "@raycast/api"
import { WEB_ORIGIN } from "./config"
import type { InterfaceContext } from "./interfaces/context"
import type { ALTEREDInterfaceItem } from "./interfaces/definitions"
import { InterfaceRenderer } from "./interfaces/renderer"

function GlobalActions({
    item,
    context
}: {
    item: ALTEREDInterfaceItem
    context: InterfaceContext
}) {
    return (
        <ActionPanel>
            {item.interfaces ? (
                <Action.Push
                    icon={Icon.ArrowRightCircle}
                    target={<InterfaceRenderer interfaces={item.interfaces} />}
                    title="Go To Interface"
                />
            ) : (
                <Action
                    icon={Icon.ArrowRightCircle}
                    onAction={() =>
                        showToast({
                            title: "No Interfaces Found",
                            message: "The item contains no interfaces.",
                            style: Toast.Style.Failure
                        })
                    }
                    title="Go To Interface"
                />
            )}

            <Action.OpenInBrowser
                icon={Icon.Globe}
                onOpen={() => {
                    showHUD("Opening in browser...")
                }}
                shortcut={{
                    modifiers: ["cmd", "shift"],
                    key: "o"
                }}
                title="Open In Browser"
                url={`${WEB_ORIGIN}/t/${item.id}`}
            />

            <ActionPanel.Section title="View">
                <Action
                    icon={
                        context.isIconVisible.value
                            ? Icon.EyeDisabled
                            : Icon.Eye
                    }
                    onAction={context.isIconVisible.toggle}
                    shortcut={{
                        modifiers: ["cmd", "shift"],
                        key: "i"
                    }}
                    title={
                        context.isIconVisible.value
                            ? "Hide Icons"
                            : "Show Icons"
                    }
                />

                {context.collectionLayout && (
                    <Action
                        icon={
                            context.collectionLayout.value === "list"
                                ? Icon.AppWindowGrid2x2
                                : Icon.List
                        }
                        onAction={context.collectionLayout.toggle}
                        shortcut={{
                            modifiers: ["cmd", "shift"],
                            key: "l"
                        }}
                        title={
                            context.collectionLayout.value === "list"
                                ? "Switch to Grid Layout"
                                : "Switch to List Layout"
                        }
                    />
                )}
            </ActionPanel.Section>
        </ActionPanel>
    )
}

export { GlobalActions }
