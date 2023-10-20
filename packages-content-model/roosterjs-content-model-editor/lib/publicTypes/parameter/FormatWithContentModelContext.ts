import type {
    ContentModelDocument,
    ContentModelEntity,
    ContentModelImage,
    DOMSelection,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Define entity lifecycle related operations
 */
export type EntityLifecycleOperation =
    /**
     * Notify plugins that there is a new plugin was added into editor.
     * Plugin can handle this event to entity hydration.
     * This event will be only fired once for each entity DOM node.
     * After undo, or copy/paste, since new DOM nodes were added, this event will be fired
     * for those entities represented by newly added nodes.
     */
    | 'newEntity'

    /**
     * Notify plugins that editor is generating HTML content for save.
     * Plugin should use this event to remove any temporary content, and only leave DOM nodes that
     * should be saved as HTML string.
     * This event will provide a cloned DOM tree for each entity, do NOT compare the DOM nodes with cached nodes
     * because it will always return false.
     */
    | 'replaceTemporaryContent'
    /**
     * Notify plugins that a new entity state need to be updated to an entity.
     * This is normally happened when user undo/redo the content with an entity snapshot added by a plugin that handles entity
     */
    | 'UpdateEntityState';

/**
 * Define entity removal related operations
 */
export type EntityRemovalOperation =
    /**
     * Notify plugins that user is removing an entity from its start position using DELETE key
     */
    | 'removeFromStart'

    /**
     * Notify plugins that user is remove an entity from its end position using BACKSPACE key
     */
    | 'removeFromEnd'

    /**
     * Notify plugins that an entity is being overwritten.
     * This can be caused by key in, cut, paste, delete, backspace ... on a selection
     * which contains some entities.
     */
    | 'overwrite';

/**
 * Define possible operations to an entity
 */
export type EntityOperation = EntityLifecycleOperation | EntityRemovalOperation;

/**
 * Represents an entity that is deleted by a specified entity operation
 */
export interface DeletedEntity {
    entity: ContentModelEntity;
    operation: EntityRemovalOperation;
}

/**
 * Context object for API formatWithContentModel
 */
export interface FormatWithContentModelContext {
    /**
     * New entities added during the format process
     */
    readonly newEntities: ContentModelEntity[];

    /**
     * Entities got deleted during formatting. Need to be set by the formatter function
     */
    readonly deletedEntities: DeletedEntity[];

    /**
     * Images inserted in the editor that needs to have their size adjusted
     */
    readonly newImages: ContentModelImage[];

    /**
     * Raw Event that triggers this format call
     */
    readonly rawEvent?: Event;

    /**
     * @optional
     * When pass true, skip adding undo snapshot when write Content Model back to DOM.
     * Need to be set by the formatter function
     */
    skipUndoSnapshot?: boolean;
}

/**
 * Options for API formatWithContentModel
 */
export interface FormatWithContentModelOptions {
    /**
     * When set to true, if there is pending format, it will be preserved after this format operation is done
     */
    preservePendingFormat?: boolean;

    /**
     * Raw event object that triggers this call
     */
    rawEvent?: Event;

    /**
     * Change source used for triggering a ContentChanged event. @default ChangeSource.Format.
     */
    changeSource?: string;

    /**
     * An optional callback that will be called when a DOM node is created
     * @param modelElement The related Content Model element
     * @param node The node created for this model element
     */
    onNodeCreated?: OnNodeCreated;

    /**
     * Optional callback to get an object used for change data in ContentChangedEvent
     */
    getChangeData?: () => any;

    /**
     * When specified, use this selection range to override current selection inside editor
     */
    selectionOverride?: DOMSelection;
}

/**
 * Type of formatter used for format Content Model.
 * @param model The source Content Model to format
 * @param context A context object used for pass in and out more parameters
 * @returns True means the model is changed and need to write back to editor, otherwise false
 */
export type ContentModelFormatter = (
    model: ContentModelDocument,
    context: FormatWithContentModelContext
) => boolean;
