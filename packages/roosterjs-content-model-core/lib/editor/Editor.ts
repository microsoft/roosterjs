import { ChangeSource } from '../constants/ChangeSource';
import { cloneModel } from '../publicApi/model/cloneModel';
import { createEditorCore } from './createEditorCore';
import { createEmptyModel, tableProcessor } from 'roosterjs-content-model-dom';
import { reducedModelChildProcessor } from '../override/reducedModelChildProcessor';
import { transformColor } from '../publicApi/color/transformColor';
import type {
    ContentModelDocument,
    ContentModelFormatter,
    ContentModelSegmentFormat,
    DarkColorHandler,
    DOMEventRecord,
    DOMHelper,
    DOMSelection,
    EditorEnvironment,
    FormatContentModelOptions,
    IEditor,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
    Snapshot,
    SnapshotsManager,
    EditorCore,
    EditorOptions,
    TrustedHTMLHandler,
    Rect,
    EntityState,
    CachedElementHandler,
} from 'roosterjs-content-model-types';

/**
 * The main editor class based on Content Model
 */
export class Editor implements IEditor {
    private core: EditorCore | null = null;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        this.core = createEditorCore(contentDiv, options);

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
     * @param mode What kind of Content Model we want. Currently we support the following values:
     * - connected: Returns a connect Content Model object. "Connected" means if there is any entity inside editor, the returned Content Model will
     * contain the same wrapper element for entity. This option should only be used in some special cases. In most cases we should use "disconnected"
     * to get a fully disconnected Content Model so that any change to the model will not impact editor content.
     * - disconnected: Returns a disconnected clone of Content Model from editor which you can do any change on it and it won't impact the editor content.
     * If there is any entity in editor, the returned object will contain cloned copy of entity wrapper element.
     * If editor is in dark mode, the cloned entity will be converted back to light mode.
     * - reduced: Returns a reduced Content Model that only contains the model of current selection. If there is already a up-to-date cached model, use it
     * instead to improve performance. This is mostly used for retrieve current format state.
     * - clean: Similar with disconnected, this will return a disconnected model, the difference is "clean" mode will not include any selection info.
     * This is usually used for exporting content
     */
    getContentModelCopy(
        mode: 'connected' | 'disconnected' | 'reduced' | 'clean'
    ): ContentModelDocument {
        const core = this.getCore();

        switch (mode) {
            case 'connected':
                return core.api.createContentModel(core, {
                    processorOverride: {
                        table: tableProcessor, // Use the original table processor to create Content Model with real table content but not just an entity
                    },
                });

            case 'disconnected':
            case 'clean':
                return cloneModel(
                    core.api.createContentModel(
                        core,
                        undefined /*option*/,
                        mode == 'clean' ? 'none' : undefined /*selectionOverride*/
                    ),
                    {
                        includeCachedElement: this.cloneOptionCallback,
                    }
                );
            case 'reduced':
                return core.api.createContentModel(core, {
                    processorOverride: {
                        child: reducedModelChildProcessor,
                    },
                });
        }
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
     * Set a new logical root (most likely due to focus change)
     * @param logicalRoot The new logical root (has to be child of physicalRoot)
     */
    setLogicalRoot(logicalRoot: HTMLDivElement) {
        const core = this.getCore();

        core.api.setLogicalRoot(core, logicalRoot);
    }

    /**
     * The general API to do format change with Content Model
     * It will grab a Content Model for current editor content, and invoke a callback function
     * to do format change. Then according to the return value, write back the modified content model into editor.
     * If there is cached model, it will be used and updated.
     * @param formatter Formatter function, see ContentModelFormatter
     * @param options More options, see FormatContentModelOptions
     */
    formatContentModel(
        formatter: ContentModelFormatter,
        options?: FormatContentModelOptions
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
     * @param entityState @optional State for entity if we want to add entity state for this snapshot
     */
    takeSnapshot(entityState?: EntityState): Snapshot | null {
        const core = this.getCore();

        return core.api.addUndoSnapshot(
            core,
            false /*canUndoByBackspace*/,
            entityState ? [entityState] : undefined
        );
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
        return this.getCore().physicalRoot.ownerDocument;
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
        return core.domHelper.hasFocus();
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
                core.physicalRoot,
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
     * Get a color manager object for this editor.
     */
    getColorManager(): DarkColorHandler {
        return this.getCore().darkColorHandler;
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
     * Get the scroll container of the editor
     */
    getScrollContainer(): HTMLElement {
        return this.getCore().domEvent.scrollContainer;
    }

    /**
     * Retrieves the rect of the visible viewport of the editor.
     */
    getVisibleViewport(): Rect | null {
        return this.getCore().api.getVisibleViewport(this.getCore());
    }

    /**
     * Add CSS rules for editor
     * @param key A string to identify the CSS rule type. When set CSS rules with the same key again, existing rules with the same key will be replaced.
     * @param cssRule The CSS rule string, must be a valid CSS rule string, or browser may throw exception. Pass null to clear existing rules
     * @param subSelectors @optional If the rule is used for child element under editor, use this parameter to specify the child elements. Each item will be
     * combined with root selector together to build a separate rule.
     */
    setEditorStyle(
        key: string,
        cssRule: string | null,
        subSelectors?: 'before' | 'after' | string[]
    ): void {
        const core = this.getCore();

        core.api.setEditorStyle(core, key, cssRule, subSelectors);
    }

    /**
     * @returns the current EditorCore object
     * @throws a standard Error if there's no core object
     */
    protected getCore(): EditorCore {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }

    private cloneOptionCallback: CachedElementHandler = (node, type) => {
        if (type == 'cache') {
            return undefined;
        }

        const result = node.cloneNode(true /*deep*/) as HTMLElement;

        if (this.isDarkMode()) {
            const colorHandler = this.getColorManager();

            transformColor(result, true /*includeSelf*/, 'darkToLight', colorHandler);

            result.style.color = result.style.color || 'inherit';
            result.style.backgroundColor = result.style.backgroundColor || 'inherit';
        }

        return result;
    };
}
