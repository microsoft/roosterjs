/**
 * @deprecated
 * Indicates the scope of a traversing
 */
const enum ContentScope {
    // Scope to a block
    Block,

    // Scope to current selection
    Selection,

    // Scope to the whole body
    Body,
}

export default ContentScope;
