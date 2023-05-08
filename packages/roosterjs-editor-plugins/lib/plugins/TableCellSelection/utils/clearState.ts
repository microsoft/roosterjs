import { IEditor } from 'roosterjs-editor-types';
import { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 */
export function clearState(state: TableCellSelectionState | null, editor: IEditor | null): void {
    editor?.select(null);
    if (state) {
        state.vTable = null;
        state.firstTarget = null;
        state.lastTarget = null;
        state.tableSelection = false;
        state.firstTable = null;
        state.targetTable = null;
        state.mouseMoveDisposer?.();
        state.mouseMoveDisposer = null;
    }
}
