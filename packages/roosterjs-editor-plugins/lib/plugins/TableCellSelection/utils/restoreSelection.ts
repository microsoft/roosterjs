import { isAfter } from './isAfter';
import { Position } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';
import { updateSelection } from './updateSelection';
import type { IEditor } from 'roosterjs-editor-types';
import type { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 */
export function restoreSelection(state: TableCellSelectionState, editor: IEditor) {
    if (!state.lastTarget || !state.firstTarget) {
        return;
    }

    if (state.firstTable) {
        editor.select(state.firstTable, null /* coordinates */);
    }
    state.tableSelection = false;
    const isBeginAboveEnd = isAfter(state.firstTarget, state.lastTarget);
    const targetPosition = new Position(
        state.lastTarget,
        isBeginAboveEnd ? PositionType.End : PositionType.Begin
    );

    const firstTargetRange = new Range();
    if (state.firstTarget) {
        firstTargetRange.selectNodeContents(state.firstTarget);
    }
    updateSelection(
        editor,
        state.firstTarget,
        isBeginAboveEnd
            ? Position.getEnd(firstTargetRange).offset
            : Position.getStart(firstTargetRange).offset,
        targetPosition.element,
        targetPosition.offset
    );
}
