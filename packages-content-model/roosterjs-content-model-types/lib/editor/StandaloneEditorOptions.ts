import type { DefaultFormat, EditorPlugin } from 'roosterjs-editor-types';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';

/**
 * Options for Content Model editor
 */
export interface StandaloneEditorOptions {
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

    /**
     * List of plugins.
     * The order of plugins here determines in what order each event will be dispatched.
     * Plugins not appear in this list will not be added to editor, including built-in plugins.
     * Default value is empty array.
     */
    plugins?: EditorPlugin[];

    /**
     * Default format of editor content. This will be applied to empty content.
     * If there is already content inside editor, format of existing content will not be changed.
     * Default value is the computed style of editor content DIV
     */
    defaultFormat?: DefaultFormat;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;
}
