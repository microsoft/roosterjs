import { IEditor } from 'roosterjs-editor-types';
import { TABLE_CELL_SELECTOR } from '../constants';

/**
 * @internal
 */
export function getCellAtCursor(editor: IEditor, node: Node) {
    if (editor) {
        return editor.getElementAtCursor(TABLE_CELL_SELECTOR, node) || (node as HTMLElement);
    }
    return node as HTMLElement;
}
