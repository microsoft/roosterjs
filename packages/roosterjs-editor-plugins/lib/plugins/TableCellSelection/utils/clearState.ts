import { IEditor } from 'roosterjs-editor-types';
import { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 */
export function clearState(state: TableCellSelectionState, editor: IEditor) {
    editor.select(null);
    state.vTable = null;
    state.firstTarget = null;
    state.lastTarget = null;
    state.tableSelection = false;
    state.firstTable = null;
    state.targetTable = null;
    state.mouseMoveDisposer?.();
    state.mouseMoveDisposer = null;
}
