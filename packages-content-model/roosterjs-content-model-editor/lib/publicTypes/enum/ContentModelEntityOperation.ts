/**
 * Define possible operations to an entity
 */
export type ContentModelEntityOperation =
    | 'newEntity'
    | 'removeFromStart'
    | 'removeFromEnd'
    | 'overwrite'
    | 'updateEntityState';
