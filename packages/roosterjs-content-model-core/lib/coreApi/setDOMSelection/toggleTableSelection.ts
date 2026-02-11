import { parseTableCells } from 'roosterjs-content-model-dom';
import { removeTableCellsStyle, setTableCellsStyle } from './setTableCellsStyle';

import type { EditorCore, TableCellCoordinate } from 'roosterjs-content-model-types';

/**
 * @internal
 * Toggle table selection styles on/off
 * @param core The EditorCore object
 * @param isHiding True to hide the table selection background, false to show it
 */
export function toggleTableSelection(core: EditorCore, isHiding: boolean) {
    const selection = core.selection.selection;

    if (selection?.type === 'table') {
        if (isHiding) {
            removeTableCellsStyle(core);
        } else {
            const { table, firstColumn, firstRow, lastColumn, lastRow } = selection;
            const parsedTable = parseTableCells(table);
            const firstCell: TableCellCoordinate = {
                row: Math.min(firstRow, lastRow),
                col: Math.min(firstColumn, lastColumn),
            };
            const lastCell: TableCellCoordinate = {
                row: Math.max(firstRow, lastRow),
                col: Math.max(firstColumn, lastColumn),
            };

            setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);
        }
    }
}
