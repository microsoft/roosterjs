import { getCellCoordinates } from '../utils/getCellCoordinates';
import { IEditor } from 'roosterjs-editor-types';
import { restoreSelection } from '../utils/restoreSelection';
import { selectTable } from '../utils/selectTable';
import { setData } from '../utils/setData';
import { TableCellSelectionState } from '../TableCellSelectionState';
import { updateSelection } from '../utils/updateSelection';

/**
 * Handle Scroll Event and mantains the selection range,
 * Since when we scroll the cursor does not trigger the on Mouse Move event
 * The table selection gets removed.
 */
export function handleScrollEvent(state: TableCellSelectionState, editor: IEditor) {
    const eventTarget = editor.getElementAtCursor();
    if (!eventTarget) {
        return;
    }
    setData(eventTarget, state, editor);
    if (
        state.firstTable == state.targetTable &&
        state.firstTarget &&
        state.vTable?.selection &&
        state.lastTarget &&
        state.tableSelection
    ) {
        const newCell = getCellCoordinates(state.vTable, state.lastTarget);
        if (newCell) {
            state.vTable.selection.lastCell = newCell;
            selectTable(editor, state);
            updateSelection(editor, state.firstTarget, 0);
        }
    } else if (state.tableSelection) {
        restoreSelection(state, editor);
    }
}
