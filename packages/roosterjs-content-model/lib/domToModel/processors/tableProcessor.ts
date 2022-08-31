import { addBlock } from '../../modelApi/common/addBlock';
import { containerProcessor } from './containerProcessor';
import { createTable } from '../../modelApi/creators/createTable';
import { createTableCell } from '../../modelApi/creators/createTableCell';
import { ElementProcessor } from './ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { TableCellFormatHandlers } from '../../formatHandlers/TableCellFormatHandler';
import { TableFormatHandlers } from '../../formatHandlers/TableFormatHandlers';

/**
 * @internal
 *
 * For Table with merged/splitted cells, HTML uses colSpan and rowSpan attributes to specify how it should be rendered.
 * To make it easier to edit a table, we will use a different way to describe table.
 *
 * 1. For a m * n table (m rows, n columns), we always create a m * n array for the cells.
 * 2. For a regular table cell, it is mapped to one item of this array
 * 3. For a merged/splitted table cell, it will has colSpan/rowSpan value. We also created TableCell model for those spanned
 * cells, and use "spanLeft" and "spanAbove" to mark its state
 * 4. When edit table, we always edit on this mapped m * n array because it always has an item for each cell
 * 5. When write back to DOM, we create TD/TH elements for those non-spanned cells, and mark its colSpan/rowSpan value according
 * its neighbour cell's spanLeft/spanAbove attribute
 */
export const tableProcessor: ElementProcessor = (group, element, context) => {
    const tableElement = element as HTMLTableElement;
    const table = createTable(tableElement.rows.length);
    const { table: selectedTable, firstCell, lastCell } = context.tableSelection || {};
    const hasTableSelection = selectedTable == tableElement && !!firstCell && !!lastCell;

    parseFormat(tableElement, TableFormatHandlers, table.format, context.contentModelContext);
    addBlock(group, table);

    const columnPositions: number[] = [0];
    const rowPositions: number[] = [0];
    const zoomScale = context.contentModelContext.zoomScale;

    for (let row = 0; row < tableElement.rows.length; row++) {
        const tr = tableElement.rows[row];
        for (let sourceCol = 0, targetCol = 0; sourceCol < tr.cells.length; sourceCol++) {
            for (; table.cells[row][targetCol]; targetCol++) {}

            const td = tr.cells[sourceCol];
            const isCellSelected =
                hasTableSelection &&
                row >= firstCell.y &&
                row <= lastCell.y &&
                targetCol >= firstCell.x &&
                targetCol <= lastCell.x;

            const colEnd = targetCol + td.colSpan;
            const rowEnd = row + td.rowSpan;
            const needCalcWidth = columnPositions[colEnd] === undefined;
            const needCalcHeight = rowPositions[rowEnd] === undefined;

            if (needCalcWidth || needCalcHeight) {
                const rect = td.getBoundingClientRect();

                if (needCalcWidth) {
                    columnPositions[colEnd] = columnPositions[targetCol] + rect.width / zoomScale;
                }
                if (needCalcHeight) {
                    rowPositions[rowEnd] = rowPositions[row] + rect.height / zoomScale;
                }
            }

            for (let colSpan = 1; colSpan <= td.colSpan; colSpan++, targetCol++) {
                for (let rowSpan = 1; rowSpan <= td.rowSpan; rowSpan++) {
                    const hasTd = colSpan == 1 && rowSpan == 1;
                    const cell = createTableCell(colSpan > 1, rowSpan > 1, td.tagName == 'TH');

                    if (isCellSelected) {
                        cell.isSelected = true;
                    }

                    table.cells[row + rowSpan - 1][targetCol] = cell;

                    if (hasTd) {
                        parseFormat(
                            td,
                            TableCellFormatHandlers,
                            cell.format,
                            context.contentModelContext
                        );

                        containerProcessor(cell, td, context);
                    }
                }
            }
        }
    }

    table.widths = calcSizes(columnPositions);
    table.heights = calcSizes(rowPositions);
};

function calcSizes(positions: number[]): number[] {
    let result: number[] = [];
    let lastPos = positions[positions.length - 1];

    for (let i = positions.length - 2; i >= 0; i--) {
        if (positions[i] === undefined) {
            result[i] = 0;
        } else {
            result[i] = lastPos - positions[i];
            lastPos = positions[i];
        }
    }

    return result;
}
