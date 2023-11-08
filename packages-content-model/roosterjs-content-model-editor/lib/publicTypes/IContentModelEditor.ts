import type { EditorOptions, IEditor } from 'roosterjs-editor-types';
import type { StandaloneEditorOptions, IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor extends IEditor, IStandaloneEditor {}

/**
 * Options for Content Model editor
 */
export interface ContentModelEditorOptions extends EditorOptions, StandaloneEditorOptions {}
