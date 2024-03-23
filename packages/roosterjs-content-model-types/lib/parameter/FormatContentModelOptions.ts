import type { ShadowInsertPoint } from '../context/DomToModelSelectionContext';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';
import type { FormatContentModelContext } from './FormatContentModelContext';
import type { OnNodeCreated } from '../context/ModelToDomSettings';

/**
 * Options for API formatWithContentModel
 */
export interface FormatContentModelOptions {
    /**
     * Name of the format API
     */
    apiName?: string;

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

    shadowInsertPoint?: ShadowInsertPoint;
}

/**
 * Type of formatter used for format Content Model.
 * @param model The source Content Model to format
 * @param context A context object used for pass in and out more parameters
 * @returns True means the model is changed and need to write back to editor, otherwise false
 */
export type ContentModelFormatter = (
    model: ContentModelDocument,
    context: FormatContentModelContext
) => boolean;
