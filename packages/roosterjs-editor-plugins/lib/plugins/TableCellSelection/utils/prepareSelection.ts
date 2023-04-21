import { findClosestElementAncestor } from 'roosterjs-editor-dom';
import { getTableAtCursor } from './getTableAtCursor';
import { IEditor } from 'roosterjs-editor-types';
import { TABLE_CELL_SELECTOR } from '../constants';
import { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 *  Check if the selection started in a inner table.
 */
export function prepareSelection(state: TableCellSelectionState, editor: IEditor) {
    if (!state.firstTable || !state.targetTable) {
        return;
    }
    let isNewTargetTableContained =
        state.lastTarget != state.firstTarget &&
        state.firstTable?.contains(
            findClosestElementAncestor(state.targetTable, state.firstTable, TABLE_CELL_SELECTOR)
        );

    if (isNewTargetTableContained && state.tableSelection) {
        while (isNewTargetTableContained) {
            state.lastTarget = findClosestElementAncestor(
                state.targetTable,
                state.firstTable,
                TABLE_CELL_SELECTOR
            );
            state.targetTable = getTableAtCursor(editor, state.lastTarget);
            isNewTargetTableContained =
                state.lastTarget != state.firstTarget &&
                state.firstTable?.contains(
                    findClosestElementAncestor(
                        state.targetTable,
                        state.firstTable,
                        TABLE_CELL_SELECTOR
                    )
                );
        }
    }

    let isFirstTargetTableContained =
        state.lastTarget != state.firstTarget &&
        state.targetTable?.contains(
            findClosestElementAncestor(state.firstTable, state.targetTable, TABLE_CELL_SELECTOR)
        );

    if (isFirstTargetTableContained && state.tableSelection && state.targetTable) {
        while (isFirstTargetTableContained) {
            state.firstTarget = findClosestElementAncestor(
                state.firstTable,
                state.targetTable,
                TABLE_CELL_SELECTOR
            );
            if (!state.firstTarget) {
                return;
            }
            state.firstTable = getTableAtCursor(editor, state.firstTarget);
            isFirstTargetTableContained =
                state.lastTarget != state.firstTarget &&
                state.targetTable?.contains(
                    findClosestElementAncestor(
                        state.firstTable,
                        state.targetTable,
                        TABLE_CELL_SELECTOR
                    )
                );
        }
    }
}
