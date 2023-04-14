import { getCellAtCursor } from './getCellAtCursor';
import { getTableAtCursor } from './getTableAtCursor';
import { IEditor } from 'roosterjs-editor-types';
import { TABLE_CELL_SELECTOR } from '../constants';
import { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 */
export function setData(eventTarget: Node, state: TableCellSelectionState, editor: IEditor) {
    const pos = editor.getFocusedPosition();
    if (pos) {
        state.firstTarget = state.firstTarget || getCellAtCursor(editor, pos.node);

        if (state.firstTarget.nodeType == Node.TEXT_NODE) {
            state.firstTarget = editor.getElementAtCursor(TABLE_CELL_SELECTOR, state.firstTarget);
        }
        if (!editor.contains(state.firstTarget) && state.lastTarget) {
            state.firstTarget = state.lastTarget;
        }
    }

    state.firstTable = getTableAtCursor(editor, state.firstTarget) as HTMLTableElement;
    state.lastTarget = getCellAtCursor(editor, eventTarget as Node);
    state.targetTable = getTableAtCursor(editor, state.lastTarget);
}
