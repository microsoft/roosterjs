/**
 * Represents context for entity
 */
export interface ModelToDomEntityContext {
    /**
     * When set to true, directly put entity DOM nodes into the result DOM tree when doing Content Model to DOM conversion and do not use placeholder
     */
    doNotReuseEntityDom: boolean;

    /**
     * Entities collected during DOM tree generation, used for reusing existing DOM structure of entities
     */
    entities: Record<string, HTMLElement>;
}
