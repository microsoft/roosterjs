import { Editor } from 'roosterjs-core';

// Check if editor has a collapsed selection
export default function isSelectionCollapsed(editor: Editor): boolean {
    let range = editor.getSelectionRange();
    return range && range.collapsed ? true : false;
}
