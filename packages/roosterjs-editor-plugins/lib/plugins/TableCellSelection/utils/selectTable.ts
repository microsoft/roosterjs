import normalizeTableSelection from './normalizeTableSelection';
import type { IEditor } from 'roosterjs-editor-types';
import type { TableCellSelectionState } from '../TableCellSelectionState';

/**
 * @internal
 */
export function selectTable(editor: IEditor, state: TableCellSelectionState) {
    if (editor && state.vTable) {
        editor?.select(state.vTable.table, normalizeTableSelection(state.vTable));
    }
}
