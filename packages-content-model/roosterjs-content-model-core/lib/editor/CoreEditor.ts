import { createContentModelEditorCore } from './createContentModelEditorCore';
import { PluginEventData, PluginEventFromType } from '../publicTypes/event/PluginEvent';
import { PluginEventType } from '../publicTypes/event/PluginEventType';
import type { EditorCore } from '../publicTypes/editor/EditorCore';
import type { EditorOptions } from '../publicTypes/editor/EditorOptions';
import type { EditorEnvironment } from '../publicTypes/editor/EditorEnvironment';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import type { ICoreEditor } from '../publicTypes/editor/ICoreEditor';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export class CoreEditor implements ICoreEditor {
    private core: EditorCore | null = null;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        this.core = createContentModelEditorCore(contentDiv, options);

        if (options.cacheModel) {
            // Create an initial content model to cache
            // TODO: Once we have standalone editor and get rid of `ensureTypeInContainer` function, we can set init content
            // using content model and cache the model directly
            this.createContentModel();
        }
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    public dispose(): void {
        const core = this.getCore();

        for (let i = core.plugins.length - 1; i >= 0; i--) {
            const plugin = core.plugins[i];

            try {
                plugin.dispose();
            } catch (e) {
                // Cache the error and pass it out, then keep going since dispose should always succeed
                // core.disposeErrorHandler?.(plugin, e as Error);
            }
        }

        core.colorManager.reset();

        this.core = null;
    }

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    public getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
    }

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    public isDisposed(): boolean {
        return !this.core;
    }

    /**
     * Check if editor is in Shadow Edit mode
     */
    public isInShadowEdit() {
        return !!this.getCore().lifecycle.isInShadowEdit;
    }

    /**
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    public hasFocus(): boolean {
        const activeElement = this.getDocument().activeElement;

        return !!activeElement && this.getCore().contentDiv.contains(activeElement);
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
    public triggerEvent<T extends PluginEventType>(
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
     * Check if editor is in IME input sequence
     * @returns True if editor is in IME input sequence, otherwise false
     */
    public isInIME(): boolean {
        // return this.getCore().domEvent.isInIME;
        return false;
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
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     * @param onNodeCreated An optional callback that will be called when a DOM node is created
     */
    setContentModel(
        model: ContentModelDocument,
        option?: ModelToDomOption,
        onNodeCreated?: OnNodeCreated
    ): DOMSelection | null {
        const core = this.getCore();

        return core.api.setContentModel(core, model, option, onNodeCreated);
    }

    /**
     * Get current running environment, such as if editor is running on Mac
     */
    getEnvironment(): EditorEnvironment {
        return this.getCore().environment;
    }

    /**
     * Get current DOM selection
     * @param forceGetNewSelection @optional True to force get a new range selection from editor UI, otherwise always try get from cache first @default false
     */
    getDOMSelection(forceGetNewSelection?: boolean): DOMSelection | null {
        const core = this.getCore();

        return core.api.getDOMSelection(core, !!forceGetNewSelection);
    }

    /**
     * Set DOMSelection into editor content.
     * This is the replacement of IEditor.select.
     * @param selection The selection to set
     */
    setDOMSelection(selection: DOMSelection) {
        const core = this.getCore();

        core.api.setDOMSelection(core, selection);
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
}
