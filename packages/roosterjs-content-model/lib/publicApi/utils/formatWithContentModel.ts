import { OnNodeCreated } from '../../publicTypes/context/ModelToDomSettings';

/**
 * @internal
 */
export interface FormatWithContentModelOptions {
    /**
     * When set to true, it will only create Content Model for selected content
     */
    useReducedModel?: boolean;

    /**
     * When set to true, if there is pending format, it will be preserved after this format operation is done
     */
    preservePendingFormat?: boolean;

    /**
     * When pass true, skip adding undo snapshot when write Content Model back to DOM
     */
    skipUndoSnapshot?: boolean;

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
}
