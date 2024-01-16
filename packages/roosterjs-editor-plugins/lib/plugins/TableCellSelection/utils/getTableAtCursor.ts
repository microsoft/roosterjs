import type { IEditor } from 'roosterjs-editor-types';
import type { Nullable } from '../TableCellSelectionState';

/**
 * @internal
 */
export function getTableAtCursor(
    editor: IEditor,
    node: Nullable<Node | EventTarget>
): HTMLTableElement | null {
    if (editor) {
        return editor.getElementAtCursor('table', node as Node) as HTMLTableElement;
    }
    return null;
}
