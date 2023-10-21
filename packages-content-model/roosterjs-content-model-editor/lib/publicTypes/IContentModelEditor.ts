import { ChangeSource, ContentChangedData } from './event/ContentModelContentChangedEvent';
import { DOMEventHandler } from './ContentModelEditorCore';
import { PluginEventData, PluginEventFromType } from './event/ContentModelPluginEvent';
import { PluginEventType } from './event/PluginEventType';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Current running environment
 */
export interface EditorEnvironment {
    /**
     * Whether editor is running on Mac
     */
    isMac?: boolean;
}

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor {
    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean;

    /**
     * Create Content Model from DOM tree in this editor
     * @param rootNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     * @param selectionOverride When specified, use this selection to override existing selection inside editor
     */
    createContentModel(
        option?: DomToModelOption,
        selectionOverride?: DOMSelection
    ): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     * @param onNodeCreated An optional callback that will be called when a DOM node is created
     */
    setContentModel(
        model: ContentModelDocument,
        option?: ModelToDomOption,
        onNodeCreated?: OnNodeCreated
    ): DOMSelection | null;

    /**
     * Get current running environment, such as if editor is running on Mac
     */
    getEnvironment(): EditorEnvironment;

    /**
     * Get current DOM selection.
     * This is the replacement of IEditor.getSelectionRangeEx.
     */
    getDOMSelection(): DOMSelection | null;

    /**
     * Set DOMSelection into editor content.
     * This is the replacement of IEditor.select.
     * @param selection The selection to set
     */
    setDOMSelection(selection: DOMSelection): void;

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document;

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean;

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    focus(): void;

    /**
     * Trigger an event to be dispatched to all plugins
     * @param eventType Type of the event
     * @param data data of the event with given type, this is the rest part of PluginEvent with the given type
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     * @returns the event object which is really passed into plugins. Some plugin may modify the event object so
     * the result of this function provides a chance to read the modified result
     */
    triggerPluginEvent<T extends PluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast?: boolean
    ): PluginEventFromType<T>;

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
     */
    addUndoSnapshot(
        callback?: () => any,
        changeSource?: ChangeSource | string,
        canUndoByBackspace?: boolean,
        additionalData?: ContentChangedData
    ): void;

    /**
     * Check if editor is in Shadow Edit mode
     */
    isInShadowEdit(): boolean;

    /**
     * Add a custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param eventName DOM event name to handle
     * @param handler Handler callback
     * @returns A dispose function. Call the function to dispose this event handler
     */
    addDomEventHandler(eventName: string, handler: DOMEventHandler): () => void;

    /**
     * Add a bunch of custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param handlerMap A event name => event handler map
     * @returns A dispose function. Call the function to dispose all event handlers added by this function
     */
    addDomEventHandler(handlerMap: Record<string, DOMEventHandler>): () => void;

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeated. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    startShadowEdit(): void;

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    stopShadowEdit(): void;
}
