import { toTitleCase } from "../../../misc/to-title-case"

/**
 * @todo P3: De-duplicate with definitions elsewhere.
 */
type BuiltinDataTypeID = "dataset" | "schema" | "thought" | "attribute"

type DataDefinitionBase = { id: string }

type CreateBuiltinDataGetterOptions<DataDefinition extends DataDefinitionBase> =
    {
        definitions: DataDefinition[]
        meta: { typeId: BuiltinDataTypeID }
    }

type CreateBuiltinDataGetterResult<DataID extends string, Data> = {
    getMany: (options: { query: { ids: DataID[] | null } }) => Data[] | null
    getOne: (options: { query: { id: DataID | null } }) => Data | null
}

function createBuiltinDataGetter<DataDefinition extends DataDefinitionBase>({
    definitions,
    meta
}: CreateBuiltinDataGetterOptions<DataDefinition>): CreateBuiltinDataGetterResult<
    DataDefinition["id"],
    DataDefinition
> {
    type Result = CreateBuiltinDataGetterResult<
        DataDefinition["id"],
        DataDefinition
    >

    const getMany: Result["getMany"] = ({ query }) => {
        if (!query.ids?.length) {
            console.warn(
                `Builtin ${toTitleCase(meta.typeId)} Retrieval Failed: No IDs were provided in the query.`,
                { query }
            )

            return null
        }

        const data = query.ids
            .map(queryId => {
                const dataItem = definitions.find(
                    definition => definition.id === queryId
                )

                if (!dataItem) {
                    console.warn(
                        `Builtin ${toTitleCase(meta.typeId)} Retrieval Failed: No ${meta.typeId} was found with the provided ID.`,
                        { query: { id: queryId } }
                    )

                    return null
                }

                return dataItem
            })
            .filter(dataItem => dataItem !== null)

        return data.length ? data : null
    }

    const getOne: Result["getOne"] = ({ query }) => {
        const [dataItem] =
            getMany({ query: { ids: query.id ? [query.id] : [] } }) ?? []

        return dataItem ?? null
    }

    return { getMany, getOne }
}

export { type BuiltinDataTypeID, createBuiltinDataGetter }
