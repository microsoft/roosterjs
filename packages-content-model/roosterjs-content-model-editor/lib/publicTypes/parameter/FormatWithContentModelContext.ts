import { EntityOperation, SelectionRangeEx } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelEntity,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import type { CompatibleEntityOperation } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Represents an entity that is deleted by a specified entity operation
 */
export interface DeletedEntity {
    entity: ContentModelEntity;
    operation:
        | EntityOperation.RemoveFromStart
        | EntityOperation.RemoveFromEnd
        | EntityOperation.Overwrite
        | CompatibleEntityOperation.RemoveFromStart
        | CompatibleEntityOperation.RemoveFromEnd
        | CompatibleEntityOperation.Overwrite;
}

/**
 * Context object for API formatWithContentModel
 */
export interface FormatWithContentModelContext {
    /**
     * Entities got deleted during formatting. Need to be set by the formatter function
     */
    readonly deletedEntities: DeletedEntity[];

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
    selectionOverride?: SelectionRangeEx;
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
