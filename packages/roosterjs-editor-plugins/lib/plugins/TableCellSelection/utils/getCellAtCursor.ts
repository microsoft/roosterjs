import { TABLE_CELL_SELECTOR } from '../constants';
import type { IEditor } from 'roosterjs-editor-types';
import type { Nullable } from '../TableCellSelectionState';

/**
 * @internal
 */
export function getCellAtCursor(editor: IEditor, node: Nullable<Node>): HTMLElement {
    if (editor) {
        return (
            editor.getElementAtCursor(TABLE_CELL_SELECTOR, node ?? undefined) ||
            (node as HTMLElement)
        );
    }
    return node as HTMLElement;
}
