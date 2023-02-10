/**
 * Represents context for entity
 */
export interface ModelToDomEntityContext {
    /**
     * Entities collected during DOM tree generation, used for reusing existing DOM structure of entities
     */
    entities: Record<string, HTMLElement>;
}
