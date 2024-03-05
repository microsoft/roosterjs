import type { DOMHelper } from '../parameter/DOMHelper';
import type { PluginEventData, PluginEventFromType } from '../event/PluginEventData';
import type { PluginEventType } from '../event/PluginEventType';
import type { DOMEventRecord } from '../parameter/DOMEventRecord';
import type { SnapshotsManager } from '../parameter/SnapshotsManager';
import type { Snapshot } from '../parameter/Snapshot';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { DOMSelection } from '../selection/DOMSelection';
import type { EditorEnvironment } from '../parameter/EditorEnvironment';
import type {
    ContentModelFormatter,
    FormatContentModelOptions,
} from '../parameter/FormatContentModelOptions';
import type { DarkColorHandler } from '../context/DarkColorHandler';
import type { TrustedHTMLHandler } from '../parameter/TrustedHTMLHandler';
import type { Rect } from '../parameter/Rect';
import type { EntityState } from '../parameter/FormatContentModelContext';

/**
 * An interface of Editor, built on top of Content Model
 */
export interface IEditor {
    /**
     * Create Content Model from DOM tree in this editor
     * @param mode What kind of Content Model we want. Currently we support the following values:
     * - connected: Returns a connect Content Model object. "Connected" means if there is any entity inside editor, the returned Content Model will
     * contain the same wrapper element for entity. This option should only be used in some special cases. In most cases we should use "disconnected"
     * to get a fully disconnected Content Model so that any change to the model will not impact editor content.
     * - disconnected: Returns a disconnected clone of Content Model from editor which you can do any change on it and it won't impact the editor content.
     * If there is any entity in editor, the returned object will contain cloned copy of entity wrapper element.
     * If editor is in dark mode, the cloned entity will be converted back to light mode.
     * - reduced: Returns a reduced Content Model that only contains the model of current selection. If there is already a up-to-date cached model, use it
     * instead to improve performance. This is mostly used for retrieve current format state.
     */
    getContentModelCopy(mode: 'connected' | 'disconnected' | 'reduced'): ContentModelDocument;

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
     * @param options More options, see FormatContentModelOptions
     */
    formatContentModel(formatter: ContentModelFormatter, options?: FormatContentModelOptions): void;

    /**
     * Get pending format of editor if any, or return null
     */
    getPendingFormat(): ContentModelSegmentFormat | null;

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean;

    /**
     * Get a DOM Helper object to help access DOM tree in editor
     */
    getDOMHelper(): DOMHelper;

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
    triggerEvent<T extends PluginEventType>(
        eventType: T,
        data: PluginEventData<T>,
        broadcast?: boolean
    ): PluginEventFromType<T>;

    /**
     * Get undo snapshots manager
     */
    getSnapshotsManager(): SnapshotsManager;

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean;

    /**
     * Set the dark mode state and transforms the content to match the new state.
     * @param isDarkMode The next status of dark mode. True if the editor should be in dark mode, false if not.
     */
    setDarkModeState(isDarkMode?: boolean): void;

    /**
     * Add a single undo snapshot to undo stack
     * @param entityState @optional State for entity if we want to add entity state for this snapshot
     */
    takeSnapshot(entityState?: EntityState): Snapshot | null;

    /**
     * Restore an undo snapshot into editor
     * @param snapshot The snapshot to restore
     */
    restoreSnapshot(snapshot: Snapshot): void;

    /**
     * Attach a DOM event to the editor content DIV
     * @param eventMap A map from event name to its handler
     */
    attachDomEvent(eventMap: Record<string, DOMEventRecord>): () => void;

    /**
     * Check if editor is in Shadow Edit mode
     */
    isInShadowEdit(): boolean;

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

    /**
     * Get a darkColorHandler object for this editor.
     */
    getColorManager(): DarkColorHandler;

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void;

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean;

    /**
     * Get a function to convert HTML string to trusted HTML string.
     * By default it will just return the input HTML directly. To override this behavior,
     * pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    getTrustedHTMLHandler(): TrustedHTMLHandler;

    /**
     * Get the scroll container of the editor
     */
    getScrollContainer(): HTMLElement;

    /**
     * Retrieves the rect of the visible viewport of the editor.
     */
    getVisibleViewport(): Rect | null;
}
