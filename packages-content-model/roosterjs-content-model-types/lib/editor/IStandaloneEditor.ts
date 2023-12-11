import type { CompatiblePluginEventType } from 'roosterjs-editor-types/lib/compatibleTypes';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { DOMSelection } from '../selection/DOMSelection';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { EditorEnvironment } from '../parameter/EditorEnvironment';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { OnNodeCreated } from '../context/ModelToDomSettings';
import type {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../parameter/FormatWithContentModelOptions';
import type {
    EditorUndoState,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * An interface of standalone Content Model editor.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IStandaloneEditor {
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
    setDOMSelection(selection: DOMSelection | null): void;

    /**
     * The general API to do format change with Content Model
     * It will grab a Content Model for current editor content, and invoke a callback function
     * to do format change. Then according to the return value, write back the modified content model into editor.
     * If there is cached model, it will be used and updated.
     * @param formatter Formatter function, see ContentModelFormatter
     * @param options More options, see FormatWithContentModelOptions
     */
    formatContentModel(
        formatter: ContentModelFormatter,
        options?: FormatWithContentModelOptions
    ): void;

    /**
     * Get pending format of editor if any, or return null
     */
    getPendingFormat(): ContentModelSegmentFormat | null;

    //#region Editor API copied from legacy editor, will be ported to use Content Model instead

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean;

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document;

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
    triggerPluginEvent<T extends PluginEventType | CompatiblePluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast?: boolean
    ): PluginEventFromType<T>;

    /**
     * Whether there is an available undo/redo snapshot
     */
    getUndoState(): EditorUndoState;

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean;

    /**
     * Get current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @returns current zoom scale number
     */
    getZoomScale(): number;

    /**
     * Undo last edit operation
     */
    undo(): void;

    /**
     * Redo next edit operation
     */
    redo(): void;

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    isInIME(): boolean;

    //#endregion
}
