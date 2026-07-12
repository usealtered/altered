import { toTitleCase } from "../../../misc/to-title-case"

/**
 * @todo P3: De-duplicate with definitions elsewhere.
 */
type BuiltinDataTypeID = "dataset" | "schema" | "thought" | "attribute"

type DataDefinitionBase = { id: string }

type DataRelationsBase<DataDefinition extends DataDefinitionBase> = {
    id: DataDefinition["id"]
}

type CreateBuiltinDataGetterOptions<
    DataDefinition extends DataDefinitionBase,
    DataRelations extends DataRelationsBase<DataDefinition>
> = {
    definitions: DataDefinition[]
    relations: DataRelations[]
    meta: { typeId: BuiltinDataTypeID }
}

type CreateBuiltinDataGetterResult<DataID extends string, Data> = {
    getMany: (options: { query: { ids?: DataID[] } }) => Data[] | null
    getOne: (options: { query: { id?: DataID } }) => Data | null
}

function createBuiltinDataGetter<
    DataDefinition extends DataDefinitionBase,
    DataRelations extends DataRelationsBase<DataDefinition>,
    Data = DataDefinition & DataRelations
>({
    definitions,
    relations,
    meta
}: CreateBuiltinDataGetterOptions<
    DataDefinition,
    DataRelations
>): CreateBuiltinDataGetterResult<DataDefinition["id"], Data> {
    type Result = ReturnType<
        typeof createBuiltinDataGetter<DataDefinition, DataRelations, Data>
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

                const dataRelations = relations.find(
                    relation => relation.id === dataItem.id
                )

                if (!dataRelations) {
                    console.warn(
                        `Builtin ${toTitleCase(meta.typeId)} Retrieval Failed: No relations were found for the provided ${meta.typeId} ID.`,
                        { query: { id: queryId } }
                    )

                    return null
                }

                return {
                    ...dataItem,

                    ...dataRelations
                } as Data
            })
            .filter(data => data !== null)

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
