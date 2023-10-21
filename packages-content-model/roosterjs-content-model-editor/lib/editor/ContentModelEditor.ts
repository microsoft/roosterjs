import { ContentModelEditorOptions } from '../publicTypes/ContentModelEditorOptions';
import { createContentModelEditorCore } from './createContentModelEditorCore';
import { PluginEventData, PluginEventFromType } from '../publicTypes/event/ContentModelPluginEvent';
import { PluginEventType } from '../publicTypes/event/PluginEventType';
import {
    ChangeSource,
    ContentChangedData,
} from '../publicTypes/event/ContentModelContentChangedEvent';
import type {
    ContentModelEditorCore,
    DOMEventHandler,
} from '../publicTypes/ContentModelEditorCore';
import type { EditorEnvironment, IContentModelEditor } from '../publicTypes/IContentModelEditor';
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
    private core: ContentModelEditorCore;

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
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
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
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
     */
    addUndoSnapshot(
        callback?: () => any,
        changeSource?: ChangeSource | string,
        canUndoByBackspace?: boolean,
        additionalData?: ContentChangedData
    ) {
        const core = this.getCore();
        core.api.addUndoSnapshot(
            core,
            callback ?? null,
            changeSource ?? null,
            canUndoByBackspace ?? false,
            additionalData
        );
    }

    /**
     * Check if editor is in Shadow Edit mode
     */
    isInShadowEdit() {
        return !!this.getCore().lifecycle.isInShadowEdit;
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
