import { addBlock, addSegment, createBr, createParagraph } from 'roosterjs-content-model-dom';
import type {
    ContentModelSegment,
    ContentModelSegmentFormat,
    ContentModelTable,
    ContentModelTableCell,
} from 'roosterjs-content-model-types';

const MIN_HEIGHT = 22;

/**
 * Normalize a Content Model table, make sure:
 * 1. Fist cells are not spanned
 * 2. Inner cells are not header
 * 3. All cells have content and width
 * 4. Table and table row have correct width/height
 * 5. Spanned cell has no child blocks
 * 6. default format is correctly applied
 * @param table The table to normalize
 * @param defaultSegmentFormat @optional Default segment format to apply to cell
 */
export function normalizeTable(
    table: ContentModelTable,
    defaultSegmentFormat?: ContentModelSegmentFormat
) {
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
        row.cells.forEach((cell, colIndex) => {
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
            } else if (rowIndex > 0 && cell.isHeader) {
                cell.isHeader = false;
                delete cell.cachedElement;
            }

            if (colIndex == 0) {
                cell.spanLeft = false;
            }

            cell.format.useBorderBox = true;
        });

        // Make sure table has correct width and height array
        if (row.height < MIN_HEIGHT) {
            row.height = MIN_HEIGHT;
        }
    });

    const columns = Math.max(...table.rows.map(row => row.cells.length));

    for (let i = 0; i < columns; i++) {
        if (table.widths[i] === undefined) {
            table.widths[i] = getTableCellWidth(columns);
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

function tryMoveBlocks(targetCell: ContentModelTableCell, sourceCell: ContentModelTableCell) {
    const onlyHasEmptyOrBr = sourceCell.blocks.every(
        block => block.blockType == 'Paragraph' && hasOnlyBrSegment(block.segments)
    );

    if (!onlyHasEmptyOrBr) {
        targetCell.blocks.push(...sourceCell.blocks);
        sourceCell.blocks = [];
    }
}

function hasOnlyBrSegment(segments: ContentModelSegment[]): boolean {
    segments = segments.filter(s => s.segmentType != 'SelectionMarker');

    return segments.length == 0 || (segments.length == 1 && segments[0].segmentType == 'Br');
}
