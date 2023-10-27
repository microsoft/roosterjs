import type { EditorOptions, IEditor } from 'roosterjs-editor-types';
import type {
    DomToModelOption,
    ICoreEditor,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * TODO: This interface will be removed once we have standalone editor ready
 */
export interface IContentModelEditor extends IEditor, ICoreEditor {}

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

    /**
     * Reuse existing DOM structure if possible, and update the model when content or selection is changed
     */
    cacheModel?: boolean;
}
