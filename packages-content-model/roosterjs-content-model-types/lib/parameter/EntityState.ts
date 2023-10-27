/**
 * State for an entity. This is used for storing entity undo snapshot
 */
export interface EntityState {
    /**
     * Type of the entity
     */
    type: string;

    /**
     * Id of the entity
     */
    id: string;

    /**
     * The state of this entity to store into undo snapshot.
     * The state can be any string, or a serialized JSON object.
     * We are using string here instead of a JSON object to make sure the whole state is serializable.
     */
    state: string;
}
