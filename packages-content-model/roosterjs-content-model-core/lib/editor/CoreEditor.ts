import { createCoreEditorCore } from './createCoreEditorCore';
import { PluginEventData, PluginEventFromType } from '../publicTypes/event/PluginEvent';
import { PluginEventType } from '../publicTypes/event/PluginEventType';
import type { ICoreEditor } from '../publicTypes/editor/ICoreEditor';
import type { CoreEditorCore } from '../publicTypes/editor/CoreEditorCore';
import type {
    ContentModelDocument,
    CoreEditorOptions,
    DOMSelection,
    DomToModelOption,
    EditorEnvironment,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * RoosterJs core editor class, based on Content Model
 */
export class CoreEditor implements ICoreEditor {
    private core: CoreEditorCore | null = null;

    /**
     * Creates an instance of EditorBase
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: CoreEditorOptions = {}) {
        this.core = createCoreEditorCore(contentDiv, options);
        this.core.plugins.forEach(plugin => plugin.initialize(this));
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void {
        const core = this.getCore();

        for (let i = core.plugins.length - 1; i >= 0; i--) {
            const plugin = core.plugins[i];

            try {
                plugin.dispose();
            } catch (e) {}
        }

        core.colorManager.reset();
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
     * Check if focus is in editor now
     * @returns true if focus is in editor, otherwise false
     */
    hasFocus(): boolean {
        const core = this.getCore();
        return core.api.hasFocus(core);
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    focus() {
        const core = this.getCore();
        core.api.focus(core);
    }

    /**
     * Transform node color mode
     * @param node The root node to transform
     * @param toDark True to transform from light mode to dark mode, otherwise transform from dark mode to light mode
     */
    transformColor(node: Node, toDark: boolean) {
        const core = this.getCore();
        core.api.transformColor(core, node, true /*includeSelf*/, toDark);
    }

    /**
     * Check if the editor is in dark mode
     * @returns True if the editor is in dark mode, otherwise false
     */
    isDarkMode(): boolean {
        return this.getCore().lifecycle.isDarkMode;
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
    public triggerPluginEvent<T extends PluginEventType>(
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
     */
    getDOMSelection(): DOMSelection | null {
        const core = this.getCore();

        return core.api.getDOMSelection(core, false /*forceGetNewSelection*/);
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
    protected getCore(): CoreEditorCore {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }
}
