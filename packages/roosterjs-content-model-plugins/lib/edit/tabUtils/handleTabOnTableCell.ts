import { clearSelectedCells, insertTableRow } from 'roosterjs-content-model-api';
import {
    createSelectionMarker,
    getFirstSelectedTable,
    mutateBlock,
    normalizeTable,
    setParagraphNotImplicit,
    setSelection,
} from 'roosterjs-content-model-dom';
import type {
    ReadonlyContentModelDocument,
    ReadonlyContentModelTableCell,
} from 'roosterjs-content-model-types';

/**
 * When the cursor is on the last cell of a table, add new row and focus first new cell.
 * @internal
 */
export function handleTabOnTableCell(
    model: ReadonlyContentModelDocument,
    cell: ReadonlyContentModelTableCell,
    rawEvent: KeyboardEvent
) {
    const readonlyTableModel = getFirstSelectedTable(model)[0];

    if (readonlyTableModel) {
        // Check if cursor is on last cell of the table
        const lastRow = readonlyTableModel.rows[readonlyTableModel.rows.length - 1];
        const lastColumn = lastRow ? lastRow.cells.length - 1 : -1;
        const lastCell = lastRow?.cells[lastColumn];

        if (!rawEvent.shiftKey && lastCell && lastCell === cell) {
            const tableModel = mutateBlock(readonlyTableModel);
            insertTableRow(tableModel, 'insertBelow');

            // Clear Table selection
            clearSelectedCells(tableModel, {
                firstRow: tableModel.rows.length - 1,
                firstColumn: 0,
                lastRow: tableModel.rows.length - 1,
                lastColumn: lastColumn,
            });
            normalizeTable(tableModel, model.format);

            // Add selection marker to the first cell of the new row
            const markerParagraph =
                tableModel.rows[tableModel.rows.length - 1]?.cells[0]?.blocks[0];
            if (markerParagraph.blockType == 'Paragraph') {
                const marker = createSelectionMarker(model.format);

                mutateBlock(markerParagraph).segments.unshift(marker);
                setParagraphNotImplicit(markerParagraph);
                setSelection(tableModel.rows[tableModel.rows.length - 1].cells[0], marker);
            }

            rawEvent.preventDefault();
            return true;
        }
    }

    return false;
}
