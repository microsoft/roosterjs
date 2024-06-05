import { addBlock } from '../common/addBlock';
import { addSegment } from '../common/addSegment';
import { createBr } from '../creators/createBr';
import { createParagraph } from '../creators/createParagraph';
import { mutateBlock } from '../common/mutate';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegment,
    ReadonlyContentModelTable,
    ReadonlyContentModelTableCell,
} from 'roosterjs-content-model-types';

/**
 * Minimum width for a table cell
 */
export const MIN_ALLOWED_TABLE_CELL_WIDTH: number = 30;
/**
 * Minimum height for a table cell
 */
export const MIN_ALLOWED_TABLE_CELL_HEIGHT: number = 22;

/**
 * Normalize a Content Model table, make sure:
 * 1. Fist cells are not spanned
 * 2. Only first column and row can have headers
 * 3. All cells have content and width
 * 4. Table and table row have correct width/height
 * 5. Spanned cell has no child blocks
 * 6. default format is correctly applied
 * @param readonlyTable The table to normalize
 * @param defaultSegmentFormat @optional Default segment format to apply to cell
 */
export function normalizeTable(
    readonlyTable: ReadonlyContentModelTable,
    defaultSegmentFormat?: ContentModelSegmentFormat
) {
    const table = mutateBlock(readonlyTable);

    // Always collapse border and use border box for table in roosterjs to make layout simpler
    const format = table.format;

    if (!format.borderCollapse || !format.useBorderBox) {
        format.borderCollapse = true;
        format.useBorderBox = true;
    }

    // Make sure all first cells are not spanned
    // Make sure all inner cells are not header
    // Make sure all cells have content and width
    table.rows.forEach((row, rowIndex) => {
        row.cells.forEach((readonlyCell, colIndex) => {
            const cell = mutateBlock(readonlyCell);

            if (cell.blocks.length == 0) {
                const format = cell.format.textColor
                    ? {
                          ...defaultSegmentFormat,
                          textColor: cell.format.textColor,
                      }
                    : defaultSegmentFormat;
                addBlock(
                    cell,
                    createParagraph(undefined /*isImplicit*/, undefined /*blockFormat*/, format)
                );
                addSegment(cell, createBr(format));
            }

            if (rowIndex == 0) {
                cell.spanAbove = false;
            } else if (rowIndex > 0 && colIndex > 0 && cell.isHeader) {
                cell.isHeader = false;
            }

            if (colIndex == 0) {
                cell.spanLeft = false;
            }

            cell.format.useBorderBox = true;
        });

        // Make sure table has correct width and height array
        if (row.height < MIN_ALLOWED_TABLE_CELL_HEIGHT) {
            row.height = MIN_ALLOWED_TABLE_CELL_HEIGHT;
        }
    });

    const columns = Math.max(...table.rows.map(row => row.cells.length));

    for (let i = 0; i < columns; i++) {
        if (table.widths[i] === undefined) {
            table.widths[i] = getTableCellWidth(columns);
        } else if (table.widths[i] < MIN_ALLOWED_TABLE_CELL_WIDTH) {
            table.widths[i] = MIN_ALLOWED_TABLE_CELL_WIDTH;
        }
    }

    // Move blocks from spanned cell to its main cell if any,
    // and remove rows/columns if all cells in it are spanned
    const colCount = table.rows[0]?.cells.length || 0;

    for (let colIndex = colCount - 1; colIndex > 0; colIndex--) {
        table.rows.forEach(row => {
            const cell = row.cells[colIndex];
            const leftCell = row.cells[colIndex - 1];
            if (cell && leftCell && cell.spanLeft) {
                tryMoveBlocks(leftCell, cell);
            }
        });

        if (table.rows.every(row => row.cells[colIndex]?.spanLeft)) {
            table.rows.forEach(row => row.cells.splice(colIndex, 1));
            table.widths.splice(
                colIndex - 1,
                2,
                table.widths[colIndex - 1] + table.widths[colIndex]
            );
        }
    }

    for (let rowIndex = table.rows.length - 1; rowIndex > 0; rowIndex--) {
        const row = table.rows[rowIndex];

        row.cells.forEach((cell, colIndex) => {
            const aboveCell = table.rows[rowIndex - 1]?.cells[colIndex];
            if (aboveCell && cell.spanAbove) {
                tryMoveBlocks(aboveCell, cell);
            }
        });

        if (row.cells.every(cell => cell.spanAbove)) {
            table.rows[rowIndex - 1].height += row.height;
            table.rows.splice(rowIndex, 1);
        }
    }
}

function getTableCellWidth(columns: number): number {
    if (columns <= 4) {
        return 120;
    } else if (columns <= 6) {
        return 100;
    } else {
        return 70;
    }
}

function tryMoveBlocks(
    targetCell: ReadonlyContentModelTableCell,
    sourceCell: ReadonlyContentModelTableCell
) {
    const onlyHasEmptyOrBr = sourceCell.blocks.every(
        block => block.blockType == 'Paragraph' && hasOnlyBrSegment(block.segments)
    );

    if (!onlyHasEmptyOrBr) {
        mutateBlock(targetCell).blocks.push(...sourceCell.blocks);
        mutateBlock(sourceCell).blocks = [];
    }
}

function hasOnlyBrSegment(segments: ReadonlyArray<ReadonlyContentModelSegment>): boolean {
    segments = segments.filter(s => s.segmentType != 'SelectionMarker');

    return segments.length == 0 || (segments.length == 1 && segments[0].segmentType == 'Br');
}
