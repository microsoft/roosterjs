import { clearSelectedCells } from 'roosterjs-content-model-api/lib/modelApi/table/clearSelectedCells';
import { insertTableRow } from 'roosterjs-content-model-api';
import {
    createSelectionMarker,
    getFirstSelectedTable,
    normalizeTable,
    setParagraphNotImplicit,
    setSelection,
} from 'roosterjs-content-model-dom';
import type { ContentModelDocument, ContentModelTableCell } from 'roosterjs-content-model-types';

/**
 * When the cursor is on the last cell of a table, add new row and focus first new cell.
 * @internal
 */
export function handleTabOnTableCell(
    model: ContentModelDocument,
    cell: ContentModelTableCell,
    rawEvent: KeyboardEvent
) {
    const tableModel = getFirstSelectedTable(model)[0];
    if (!rawEvent.shiftKey && tableModel) {
        // Check if cursor is on last cell of the table
        if (
            tableModel.rows[tableModel.rows.length - 1].cells[tableModel.widths.length - 1] === cell
        ) {
            insertTableRow(tableModel, 'insertBelow');
            clearSelectedCells(tableModel, {
                firstRow: tableModel.rows.length - 1,
                firstColumn: 0,
                lastRow: tableModel.rows.length - 1,
                lastColumn: tableModel.widths.length - 1,
            });
            normalizeTable(tableModel, model.format);
            const markerParagraph = tableModel.rows[tableModel.rows.length - 1].cells[0].blocks[0];

            if (markerParagraph.blockType == 'Paragraph') {
                const marker = createSelectionMarker(model.format);

                markerParagraph.segments.unshift(marker);
                setParagraphNotImplicit(markerParagraph);
                setSelection(tableModel.rows[tableModel.rows.length - 1].cells[0], marker);
            }

            rawEvent.preventDefault();
            return true;
        }
        return false;
    }
    return false;
}
