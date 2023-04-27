import { IEditor } from 'roosterjs-editor-types';
import { Nullable } from '../TableCellSelectionState';
import { TABLE_CELL_SELECTOR } from '../constants';

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
