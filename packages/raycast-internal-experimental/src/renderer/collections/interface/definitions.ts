import { Grid } from "@raycast/api"

const COLLECTION_INTERFACE_GRID_LAYOUT_COLUMNS = 7

/**
 * @todo P3: Like Raycast icons, create a serialization adapter if we plan to control this over the wire.
 */
const COLLECTION_INTERFACE_GRID_LAYOUT_INSET = Grid.Inset.Large

const COLLECTION_INTERFACE_SEARCH_BAR_PLACEHOLDER =
    "Search your ALTERED Systems"

export {
    COLLECTION_INTERFACE_GRID_LAYOUT_COLUMNS,
    COLLECTION_INTERFACE_GRID_LAYOUT_INSET,
    COLLECTION_INTERFACE_SEARCH_BAR_PLACEHOLDER
}
