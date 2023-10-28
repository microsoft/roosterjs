import type { EditorOptions, IEditor } from 'roosterjs-editor-types';
import type { CoreEditorOptions, ICoreEditor } from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * TODO: This interface will be removed once we have standalone editor ready
 */
export interface IContentModelEditor extends IEditor, ICoreEditor {}

/**
 * Options for Content Model editor
 * TODO: This interface will be removed once we have standalone editor ready
 */
export interface ContentModelEditorOptions extends CoreEditorOptions, EditorOptions {}
