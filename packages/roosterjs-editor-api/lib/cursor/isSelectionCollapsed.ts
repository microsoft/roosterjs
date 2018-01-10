import { Editor } from 'roosterjs-editor-core';

/**
 * Check if editor has a collapsed selection
 * @param editor The editor instance
 * @returns True if selection is collapsed, false otherwise
 */
export default function isSelectionCollapsed(editor: Editor): boolean {
    let range = editor.getSelectionRange();
    return range && range.collapsed ? true : false;
}
