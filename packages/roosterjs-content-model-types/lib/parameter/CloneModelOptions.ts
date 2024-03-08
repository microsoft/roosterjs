/**
 * Function type used for cloneModel API to specify how to handle cached element when clone a model
 * @param node The cached node
 * @param type Type of the node, it can be
 * - general: DOM element of ContentModelGeneralSegment or ContentModelGeneralBlock
 * - entity: Wrapper element in ContentModelEntity
 * - cache: Cached node in other model element that supports cache
 */
export type CachedElementHandler = (
    node: HTMLElement,
    type: 'general' | 'entity' | 'cache'
) => HTMLElement | undefined;

/**
 *
 * Options for cloneModel API
 */
export interface CloneModelOptions {
    /**
     * Specify how to deal with cached element, including cached block element, element in General Model, and wrapper element in Entity
     * - True: Cloned model will have the same reference to the cached element
     * - False/Not passed: For cached block element, cached element will be undefined. For General Model and Entity, the element will have deep clone and assign to the cloned model
     * - A callback: invoke the callback with the source cached element and a string to specify model type, let the callback return the expected value of cached element.
     * For General Model and Entity, the callback must return a valid element, otherwise there will be exception thrown.
     */
    includeCachedElement?: boolean | CachedElementHandler;
}
