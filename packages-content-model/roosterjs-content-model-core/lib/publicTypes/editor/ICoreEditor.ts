import { PluginEventData, PluginEventFromType } from '../event/PluginEvent';
import { PluginEventType } from '../event/PluginEventType';
import {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    EditorEnvironment,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * An interface of editor based on RoosterJs Content Model
 */
export interface ICoreEditor {
    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void;

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
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean;

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    focus(): void;

    /**
     * Transform node color mode
     * @param node The root node to transform
     * @param toDark True to transform from light mode to dark mode, otherwise transform from dark mode to light mode
     */
    transformColor(node: Node, toDark: boolean): void;

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean;

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
}
