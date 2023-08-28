import { ContentModelEditorOptions, IContentModelEditor } from '../publicTypes/IContentModelEditor';
import { createContentModelEditorCore } from './createContentModelEditorCore';
import { EditorBase } from 'roosterjs-editor-core';
import {
    ContentModelEditorCore,
    CreateContentModelOptions,
} from '../publicTypes/ContentModelEditorCore';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Editor for Content Model.
 * (This class is still under development, and may still be changed in the future with some breaking changes)
 */
export default class ContentModelEditor
    extends EditorBase<ContentModelEditorCore, ContentModelEditorOptions>
    implements IContentModelEditor {
    /**
     * Creates an instance of Editor
     * @param contentDiv The DIV HTML element which will be the container element of editor
     * @param options An optional options object to customize the editor
     */
    constructor(contentDiv: HTMLDivElement, options: ContentModelEditorOptions = {}) {
        super(contentDiv, options, createContentModelEditorCore);
    }

    /**
     * Create Content Model from DOM tree in this editor
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: CreateContentModelOptions): ContentModelDocument {
        const core = this.getCore();

        return core.api.createContentModel(core, option || {});
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
     * Clear cached content model and selection if any
     */
    clearCachedModel() {
        const core = this.getCore();

        if (!core.lifecycle.shadowEditFragment) {
            core.cachedModel = undefined;

            core.cache.nextSequenceNumber = 0;
            core.cache.index = {};
            core.cache.cachedRangeEx = undefined;
        }
    }

    /**
     * Get default format as ContentModelSegmentFormat.
     * This is a replacement of IEditor.getDefaultFormat for Content Model.
     * @returns The default format
     */
    getContentModelDefaultFormat(): ContentModelSegmentFormat {
        const core = this.getCore();

        return core.defaultFormat;
    }
}
