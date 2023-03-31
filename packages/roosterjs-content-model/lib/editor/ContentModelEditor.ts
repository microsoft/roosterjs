import { ContentModelDocument } from '../publicTypes/group/ContentModelDocument';
import { ContentModelEditorCore } from '../publicTypes/ContentModelEditorCore';
import { createContentModelEditorCore } from './createContentModelEditorCore';
import { EditorBase } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { switchShadowEdit } from './coreApi/switchShadowEdit';
import {
    DomToModelOption,
    IContentModelEditor,
    ModelToDomOption,
} from '../publicTypes/IContentModelEditor';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor extends EditorBase<ContentModelEditorCore>
    implements IContentModelEditor {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: EditorOptions = {}) {
        super(contentDiv, options, createContentModelEditorCore);

        const core = this.getCore();

        if (core.reuseModel) {
            // Only use Content Model shadow edit when reuse model is enabled because it relies on cached model for the original model
            core.api.switchShadowEdit = switchShadowEdit;
        }
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

        if (core.reuseModel && !core.lifecycle.shadowEditFragment) {
            core.cachedModel = model || undefined;
        }
    }
}
