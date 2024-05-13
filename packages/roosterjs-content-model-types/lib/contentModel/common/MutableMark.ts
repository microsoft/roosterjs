/**
 * A tag type to mark a content model type as mutable.
 *
 * This is generally a workaround to https://github.com/microsoft/TypeScript/issues/13347
 *
 * In order to know if a block has been changed, we want to mark all blocks, blocks groups, segments and their members as readonly,
 * When we want to change a block/segment/block group, we need to call a function to convert it to mutable. Inside this function
 * we can make some change to the object (e.g. remove cached element if any) so later we know this object is changed.
 * So that we expect there is a build time error if we assign a readonly object to a function that accepts mutable object only.
 * However this does not happen today.
 *
 * To workaround it, we manually add a hidden member (dummy) to all mutable types, and add another member with readonly array type to
 * readonly types. When we assign readonly object to mutable one, compiler will fail to build since the two arrays are not matching.
 * So that we can know where to fix from build time. And since the dummy value is optional, it won't break existing creator code.
 *
 * @example
 * let readonly: ReadonlyMark = {};
 * let mutable: MutableMark = {};
 *
 * readonly = mutable; // OK
 * mutable = readonly; // Error: Type 'ReadonlyMark' is not assignable to type 'MutableMark'.
 */
export type MutableMark = {
    /**
     * The mutable marker to mark an object as mutable. When assign readonly object to a mutable type, compile will fail to build
     * due to this member does not exist from source type.
     */
    readonly dummy?: never[];
};
