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
 * To workaround it, we manually add a hidden member (mutableMark) to all mutable types, when we assign readonly object to mutable one,
 * compiler will fail to build since the source type does not have this mutableMark member. So that we can know where to fix from build time.
 */
export type Mutable = {
    /**
     * The mutable marker to mark an object as mutable. When assign readonly object to a mutable type, compile will fail to build
     * due to this member does not exist from source type.
     *
     * TODO: We temporarily make it as optional to make existing code pass the build for now. In further steps we will make this as required.
     */
    readonly mutableMark?: never;
};
