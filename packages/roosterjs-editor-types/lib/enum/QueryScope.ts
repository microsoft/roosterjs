/**
 * Query scope for queryElements() API
 */
export enum QueryScope {
    /**
     * Query from the whole body of root node. This is default value.
     */
    Body,

    /**
     * Query elements on a given selection (intersect)
     * The result element can contain the selection, contain part of selection, or inside selection
     */
    OnSelection,

    /**
     * Query elements inside a given selection only
     */
    InSelection,
}
