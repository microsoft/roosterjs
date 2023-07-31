import DarkColorHandlerImpl from 'roosterjs-editor-core/lib/editor/DarkColorHandlerImpl';
import { addUndoSnapshot } from '../coreApi/addUndoSnapshot';
import { ContentModelEditor2Core } from './ContentModelEditor2Core';
import { ContentModelEditor2Options } from './ContentModelEditor2Options';
import { createContentModel } from '../coreApi/createContentModel';
import { createEditorContext } from '../coreApi/createEditorContext';
import { focus } from '../coreApi/focus';
import { getDarkColor } from 'roosterjs-color-utils';
import { getSelectionRangeEx } from '../coreApi/getSelectionRangeEx';
import { Position } from 'roosterjs-editor-dom';
import { select } from '../coreApi/select';
import { setContentModel } from '../coreApi/setContentModel';
import { triggerEvent } from '../coreApi/triggerEvent';
import {
    ChangeSource,
    ContentChangedData,
    NodePosition,
    PluginEventData,
    PluginEventFromType,
    PluginEventType,
} from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    DomToModelOption,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Core Editor for Content Model
 */
export class ContentModelEditor2 {
    private core: ContentModelEditor2Core | null;

    constructor(contentDiv: HTMLDivElement, option?: ContentModelEditor2Options) {
        const core: ContentModelEditor2Core = {
            contentDiv,
            api: {
                createContentModel,
                createEditorContext,
                setContentModel,
                addUndoSnapshot,
                focus,
                getSelectionRangeEx,
                select,
                triggerEvent,
            },
            defaultDomToModelOptions: option?.defaultDomToModelOptions || {},
            defaultModelToDomOptions: option?.defaultModelToDomOptions || {},
            darkColorHandler: new DarkColorHandlerImpl(contentDiv, getDarkColor),
            defaultFormat: option?.defaultFormat || {},
        };

        core.contentDiv.contentEditable = 'true';

        this.core = core;
    }

    dispose() {
        if (this.core) {
            this.core.contentDiv.contentEditable = 'false';
            this.core = null;
        }
    }

    isDisposed() {
        return !this.core;
    }

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    public getDocument(): Document {
        return this.getCore().contentDiv.ownerDocument;
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        const core = this.getCore();

        return core.api.createContentModel(core, option);
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        const core = this.getCore();

        core.api.setContentModel(core, model, option);
    }

    /**
     * Cache a content model object. Next time when format with content model, we can reuse it.
     * @param model
     */
    cacheContentModel(model: ContentModelDocument | null) {
        const core = this.getCore();

        if (!core.isInShadowEdit) {
            core.cachedModel = model || undefined;
            core.cachedRangeEx = undefined;
        }
    }

    /**
     * Focus to this editor, the selection was restored to where it was before, no unexpected scroll.
     */
    public focus() {
        const core = this.getCore();
        core.api.focus(core);
    }

    /**
     * Get current focused position. Return null if editor doesn't have focus at this time.
     */
    public getFocusedPosition(): NodePosition | null {
        let sel = this.getDocument().defaultView?.getSelection();
        if (sel?.focusNode && this.contains(sel.focusNode)) {
            return new Position(sel.focusNode, sel.focusOffset);
        }

        let range = this.getSelectionRange();
        if (range) {
            return Position.getStart(range);
        }

        return null;
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
        let event = ({
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
    public addUndoSnapshot(
        callback?: (start: NodePosition | null, end: NodePosition | null) => any,
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

    setDarkModeState() {}

    setZoomScale() {}

    /**
     * @returns the current EditorCore object
     * @throws a standard Error if there's no core object
     */
    protected getCore(): ContentModelEditor2Core {
        if (!this.core) {
            throw new Error('Editor is already disposed');
        }
        return this.core;
    }
}
