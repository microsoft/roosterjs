import { ChangeSource } from '../constants/ChangeSource';
import { createEmptyModel } from 'roosterjs-content-model-dom';
import { createStandaloneEditorCore } from './createStandaloneEditorCore';
import { transformColor } from '../publicApi/color/transformColor';
import type {
    ClipboardData,
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    DarkColorHandler,
    DOMEventRecord,
    DOMHelper,
    DOMSelection,
    DomToModelOption,
    EditorEnvironment,
    FormatWithContentModelOptions,
    IStandaloneEditor,
    PasteType,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
    Snapshot,
    SnapshotsManager,
    StandaloneEditorCore,
    StandaloneEditorOptions,
    TrustedHTMLHandler,
} from 'roosterjs-content-model-types';

/**
 * The standalone editor class based on Content Model
 */
export class StandaloneEditor implements IStandaloneEditor {
    private core: StandaloneEditorCore | null = null;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(
        contentDiv: HTMLDivElement,
        options: StandaloneEditorOptions = {},
        onBeforeInitializePlugins?: () => void
    ) {
        this.core = createStandaloneEditorCore(contentDiv, options);

        onBeforeInitializePlugins?.();

        const initialModel = options.initialModel ?? createEmptyModel(options.defaultSegmentFormat);

        this.core.api.setContentModel(this.core, initialModel, { ignoreSelection: true });
        this.core.plugins.forEach(plugin => plugin.initialize(this));
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose() {
        const core = this.getCore();

        for (let i = core.plugins.length - 1; i >= 0; i--) {
            const plugin = core.plugins[i];

            try {
                plugin.dispose();
            } catch (e) {
                // Cache the error and pass it out, then keep going since dispose should always succeed
                core.disposeErrorHandler?.(plugin, e as Error);
            }
        }

        core.darkColorHandler.reset();

        this.core = null;
    }

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean {
        return !this.core;
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(
        option?: DomToModelOption,
        selectionOverride?: DOMSelection
    ): ContentModelDocument {
        const core = this.getCore();

        return core.api.createContentModel(core, option, selectionOverride);
    }

    /**
     * Get current running environment, such as if editor is running on Mac
     */
    getEnvironment(): EditorEnvironment {
        return this.getCore().environment;
    }

    /**
     * Get current DOM selection
     */
    getDOMSelection(): DOMSelection | null {
        const core = this.getCore();

        return core.api.getDOMSelection(core);
    }

    /**
     * Set DOMSelection into editor content.
     * @param selection The selection to set
     */
    setDOMSelection(selection: DOMSelection | null) {
        const core = this.getCore();

        core.api.setDOMSelection(core, selection);
    }

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
    ): void {
        const core = this.getCore();

        core.api.formatContentModel(core, formatter, options);
    }

    /**
     * Get pending format of editor if any, or return null
     */
    getPendingFormat(): ContentModelSegmentFormat | null {
        return this.getCore().format.pendingFormat?.format ?? null;
    }

    /**
     * Get a DOM Helper object to help access DOM tree in editor
     */
    getDOMHelper(): DOMHelper {
        return this.getCore().domHelper;
    }

    /**
     * Add a single undo snapshot to undo stack
     */
    takeSnapshot(): Snapshot | null {
        const core = this.getCore();

        return core.api.addUndoSnapshot(core, false /*canUndoByBackspace*/);
    }

    /**
     * Restore an undo snapshot into editor
     * @param snapshot The snapshot to restore
     */
    restoreSnapshot(snapshot: Snapshot): void {
        const core = this.getCore();

        core.api.restoreUndoSnapshot(core, snapshot);
    }

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    focus() {
        const core = this.getCore();
        core.api.focus(core);
    }

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean {
        const core = this.getCore();
        return core.api.hasFocus(core);
    }

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
        broadcast: boolean = false
    ): PluginEventFromType<T> {
        const core = this.getCore();
        const event = ({
            eventType,
            ...data,
        } as any) as PluginEventFromType<T>;
        core.api.triggerEvent(core, event, broadcast);

        return event;
    }

    /**
     * Attach a DOM event to the editor content DIV
     * @param eventMap A map from event name to its handler
     */
    attachDomEvent(eventMap: Record<string, DOMEventRecord>): () => void {
        const core = this.getCore();
        return core.api.attachDomEvent(core, eventMap);
    }

    /**
     * Get undo snapshots manager
     */
    getSnapshotsManager(): SnapshotsManager {
        const core = this.getCore();

        return core.undo.snapshotsManager;
    }

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean {
        return this.getCore().lifecycle.isDarkMode;
    }

    /**
     * Set the dark mode state and transforms the content to match the new state.
     * @param isDarkMode The next status of dark mode. True if the editor should be in dark mode, false if not.
     */
    setDarkModeState(isDarkMode?: boolean) {
        const core = this.getCore();

        if (!!isDarkMode != core.lifecycle.isDarkMode) {
            transformColor(
                core.contentDiv,
                false /*includeSelf*/,
                isDarkMode ? 'lightToDark' : 'darkToLight',
                core.darkColorHandler
            );

            core.lifecycle.isDarkMode = !!isDarkMode;

            core.api.triggerEvent(
                core,
                {
                    eventType: 'contentChanged',
                    source: isDarkMode
                        ? ChangeSource.SwitchToDarkMode
                        : ChangeSource.SwitchToLightMode,
                },
                true
            );
        }
    }

    /**
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    isInIME(): boolean {
        return this.getCore().domEvent.isInIME;
    }

    /**
     * Check if editor is in Shadow Edit mode
     */
    isInShadowEdit() {
        return !!this.getCore().lifecycle.shadowEditFragment;
    }

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeated. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    startShadowEdit() {
        const core = this.getCore();
        core.api.switchShadowEdit(core, true /*isOn*/);
    }

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    stopShadowEdit() {
        const core = this.getCore();
        core.api.switchShadowEdit(core, false /*isOn*/);
    }

    /**
     * Paste into editor using a clipboardData object
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param pasteType Type of paste
     */
    pasteFromClipboard(clipboardData: ClipboardData, pasteType: PasteType = 'normal') {
        const core = this.getCore();

        core.api.paste(core, clipboardData, pasteType);
    }

    /**
     * Get a color manager object for this editor.
     */
    getColorManager(): DarkColorHandler {
        return this.getCore().darkColorHandler;
    }

    /**
     * Check if the given DOM node is in editor
     * @param node The node to check
     */
    isNodeInEditor(node: Node): boolean {
        const core = this.getCore();

        return core.contentDiv.contains(node);
    }

    /**
     * Get current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @returns current zoom scale number
     */
    getZoomScale(): number {
        return this.getCore().zoomScale;
    }

    /**
     * Set current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using EditorOptions.zoomScale
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     * @param scale The new scale number to set. It should be positive number and no greater than 10, otherwise it will be ignored.
     */
    setZoomScale(scale: number): void {
        const core = this.getCore();

        if (scale > 0 && scale <= 10) {
            const oldValue = core.zoomScale;
            core.zoomScale = scale;

            if (oldValue != scale) {
                this.triggerEvent(
                    'zoomChanged',
                    {
                        oldZoomScale: oldValue,
                        newZoomScale: scale,
                    },
                    true /*broadcast*/
                );
            }
        }
    }

    /**
     * Get a function to convert HTML string to trusted HTML string.
     * By default it will just return the input HTML directly. To override this behavior,
     * pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    getTrustedHTMLHandler(): TrustedHTMLHandler {
        return this.getCore().trustedHTMLHandler;
    }

    /**
     * @returns the current StandaloneEditorCore object
     * @throws a standard Error if there's no core object
     */
    protected getCore(): StandaloneEditorCore {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }
}
