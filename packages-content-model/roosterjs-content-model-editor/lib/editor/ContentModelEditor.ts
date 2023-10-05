import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { ContentModelPluginEventType } from '../publicTypes/event/ContentModelPluginEventType';
import { createContentModelEditorCore } from './createContentModelEditorCore';
import { DOMEventHandler } from '../publicTypes/interface/domEventHandler';
import {
    ContentModelPluginEventData,
    ContentModelPluginEventFromType,
} from '../publicTypes/event/ContentModelPluginEventData';
import type {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../publicTypes/IContentModelEditor';
import type {
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor implements IContentModelEditor {
    private core?: ContentModelEditorCore;

    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: ContentModelEditorOptions = {}) {
        this.core = createContentModelEditorCore(contentDiv, options);

        // Create an initial content model to cache
        // TODO: Once we have standalone editor and get rid of `ensureTypeInContainer` function, we can set init content
        // using content model and cache the model directly
        this.createContentModel();
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void {
        const core = this.getCore();

        for (let i = core.plugins.length - 1; i >= 0; i--) {
            core.plugins[i].dispose();
        }

        core.darkColorHandler.reset();
        this.core = undefined;
    }

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean {
        return !this.core;
    }

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
    }

    addDomEventHandler(
        nameOrMap: string | Record<string, DOMEventHandler>,
        handler?: DOMEventHandler
    ): () => void {
        const eventsToMap = typeof nameOrMap == 'string' ? { [nameOrMap]: handler! } : nameOrMap;
        const core = this.getCore();
        return core.api.attachDomEvent(core, eventsToMap);
    }

    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it if it is specified. Otherwise return undefined
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    getCustomData<T>(key: string, getter?: () => T, disposer?: (value: T) => void): T {
        const core = this.getCore();
        return (core.lifecycle.customData[key] = core.lifecycle.customData[key] || {
            value: getter ? getter() : undefined,
            disposer,
        }).value as T;
    }

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
     */
    public addUndoSnapshot(
        callback?: () => any,
        changeSource?: string,
        canUndoByBackspace?: boolean
        // additionalData?: ContentChangedData
    ) {
        const core = this.getCore();
        core.api.addUndoSnapshot(
            core,
            callback ?? null,
            changeSource ?? null,
            canUndoByBackspace ?? false
            // additionalData
        );
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
    triggerPluginEvent<T extends ContentModelPluginEventType>(
        eventType: T,
        data: ContentModelPluginEventData<T>,
        broadcast: boolean = false
    ): ContentModelPluginEventFromType<T> {
        const core = this.getCore();
        let event = ({
            eventType,
            ...data,
        } as any) as ContentModelPluginEventFromType<T>;
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
     * Get current DOM selection
     */
    getDOMSelection(): DOMSelection | null {
        const core = this.getCore();

        return core.api.getDOMSelection(core);
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
    protected getCore(): ContentModelEditorCore {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }
}
