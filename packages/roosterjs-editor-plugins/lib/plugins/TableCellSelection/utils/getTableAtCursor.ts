import { IEditor } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function getTableAtCursor(editor: IEditor, node: Node | EventTarget) {
    if (editor) {
        return editor.getElementAtCursor('table', node as Node);
    }
    return null;
}
