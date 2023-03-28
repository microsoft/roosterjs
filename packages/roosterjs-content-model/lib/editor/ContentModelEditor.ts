import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../publicTypes/format/ContentModelSegmentFormat';
import { createContentModel, setContentModel, switchShadowEdit } from './coreApi/switchShadowEdit';
import { Editor } from 'roosterjs-editor-core';
import { EditorCore, EditorOptions, ExperimentalFeatures } from 'roosterjs-editor-types';

import {
    DomToModelOption,
    IContentModelEditor,
    ModelToDomOption,
} from '../publicTypes/IContentModelEditor';

export interface ContentModelEditorCore extends EditorCore {
    shadowEditContentModel?: ContentModelDocument;
    originalContentModel?: ContentModelDocument;

    cachedModel: ContentModelDocument | null;
    reuseModel: boolean;
    defaultFormat: ContentModelSegmentFormat;
}

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor extends Editor implements IContentModelEditor {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        super(contentDiv, options);

        const core = this.getCore();
        core.cachedModel = null;
        core.reuseModel = this.isFeatureEnabled(ExperimentalFeatures.ReusableContentModel);
        core.defaultFormat = this.getDefaultSegmentFormat();
    }

    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose() {
        this.getCore().cachedModel = null;
        super.dispose();
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument {
        return createContentModel(this.getCore(), option);
    }

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption) {
        setContentModel(this.getCore(), model, option);
    }

    /**
     * Cache a content model object. Next time when format with content model, we can reuse it.
     * @param model
     */
    cacheContentModel(model: ContentModelDocument | null) {
        const core = this.getCore();

        if (core.reuseModel) {
            core.cachedModel = model;
        }
    }

    /**
     * Make the editor in "Shadow Edit" mode.
     * In Shadow Edit mode, all format change will finally be ignored.
     * This can be used for building a live preview feature for format button, to allow user
     * see format result without really apply it.
     * This function can be called repeated. If editor is already in shadow edit mode, we can still
     * use this function to do more shadow edit operation.
     */
    public startShadowEdit() {
        const core = this.getCore();
        switchShadowEdit(core, true /*isOn*/);
    }

    /**
     * Leave "Shadow Edit" mode, all changes made during shadow edit will be discarded
     */
    public stopShadowEdit() {
        const core = this.getCore();
        switchShadowEdit(core, false /*isOn*/);
    }

    protected getCore(): ContentModelEditorCore {
        return super.getCore() as ContentModelEditorCore;
    }

    private getDefaultSegmentFormat(): ContentModelSegmentFormat {
        const format = this.getDefaultFormat();

        return {
            fontWeight: format.bold ? 'bold' : undefined,
            italic: format.italic || undefined,
            underline: format.underline || undefined,
            fontFamily: format.fontFamily || undefined,
            fontSize: format.fontSize || undefined,
            textColor: format.textColors?.lightModeColor || format.textColor || undefined,
            backgroundColor:
                format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
        };
    }
}
