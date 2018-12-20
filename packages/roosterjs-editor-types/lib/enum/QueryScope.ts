/**
 * Query scope for queryElements() API
 */
const enum QueryScope {
    /**
     * Query from the whole body of root node. This is default value.
     */
    Body,

    /**
     * Query elements on a given selction (intersect)
     * The result element can contain the selection, contain part of selection, or inside selection
     */
    OnSelection,

    /**
     * Query elements inside a given selection only
     */
    InSelection,
}

export default QueryScope;
