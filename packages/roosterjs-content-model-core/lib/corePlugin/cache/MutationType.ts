/**
 * @internal Type of mutations
 */
export type MutationType =
    /**
     * We found some change happened but we cannot handle it, so set mutation type as "unknown"
     */
    | 'unknown'
    /**
     * Element id is changed
     */
    | 'elementId'
    /**
     * Only text is changed
     */
    | 'text'
    /**
     * Child list is changed
     */
    | 'childList'
    /**
     * Hint text node is changed
     */
    | 'hintText';

/**
 * @internal
 */
export interface MutationBase<T extends MutationType> {
    type: T;
}

/**
 * @internal
 */
export interface UnknownMutation extends MutationBase<'unknown'> {}

/**
 * @internal
 */
export interface ElementIdMutation extends MutationBase<'elementId'> {
    element: HTMLElement;
}

/**
 * @internal
 */
export interface TextMutation extends MutationBase<'text'> {}

/**
 * @internal
 */
export interface ChildListMutation extends MutationBase<'childList'> {
    addedNodes: Node[];
    removedNodes: Node[];
}

/**
 * @internal
 */
export interface HintTextMutation extends MutationBase<'hintText'> {
    hintNode: HTMLElement;
}

/**
 * @internal
 */
export type Mutation =
    | UnknownMutation
    | ElementIdMutation
    | TextMutation
    | ChildListMutation
    | HintTextMutation;
