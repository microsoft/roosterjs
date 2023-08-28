import { CreateContentModelOptions } from './ContentModelEditorCore';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor extends IEditor {
    /**
     * Create Content Model from DOM tree in this editor
     * @param option The options to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: CreateContentModelOptions): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption): void;

    /**
     * Cache a content model object. Next time when format with content model, we can reuse it.
     * @param model
     */
    clearCachedModel(): void;

    /**
     * Get default format as ContentModelSegmentFormat.
     * This is a replacement of IEditor.getDefaultFormat for Content Model.
     * @returns The default format
     */
    getContentModelDefaultFormat(): ContentModelSegmentFormat;
}

/**
 * Options for Content Model editor
 */
export interface ContentModelEditorOptions extends EditorOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;
}
