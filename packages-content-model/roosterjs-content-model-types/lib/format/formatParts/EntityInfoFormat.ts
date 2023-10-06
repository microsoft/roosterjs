/**
 * Format of entity type
 */
export type EntityInfoFormat = {
    /**
     * For a readonly DOM element, we also treat it as entity, with isFakeEntity set to true
     */
    isFakeEntity?: boolean;

    /**
     * Whether the entity is readonly
     */
    isReadonly?: boolean;

    /**
     * Type of this entity
     */
    entityType?: string;
};
