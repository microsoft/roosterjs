import { Editor, EditorPlugin } from 'roosterjs-editor-core';
/**
 * Create an editor instance with most common options
 * @param contentDiv The html div element needed for creating the editor
 * @param additionalPlugins The additional user defined plugins. Currently the default plugins that are already included are
 * DefalutShortcut, HyperLink, Paste, and ContentEdit, user don't need to add those.
 * @param initialContent The initial content to show in editor. It can't be removed by undo, user need to manually remove it if needed.
 * @returns The editor instance
 */
export default function createEditor(contentDiv: HTMLDivElement, additionalPlugins?: EditorPlugin[], initialContent?: string): Editor;
