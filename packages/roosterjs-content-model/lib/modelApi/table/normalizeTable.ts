import { addSegment } from '../../modelApi/common/addSegment';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { createBr } from '../../modelApi/creators/createBr';

/**
 * @internal
 */
export function normalizeTable(table: ContentModelTable) {
    // Always collapse border and use border box for table in roosterjs to make layout simpler
    table.format.borderCollapse = true;
    table.format.useBorderBox = true;

    // Make sure all first cells are not spanned
    // Make sure all inner cells are not header
    // Make sure all cells have content and width
    table.cells.forEach((row, rowIndex) =>
        row.forEach((cell, colIndex) => {
            if (cell.blocks.length == 0) {
                addSegment(cell, createBr());
            }

            if (typeof cell.format.width === 'undefined') {
                cell.format.width = getTableCellWidth(row.length);
            }

            if (rowIndex == 0) {
                cell.spanAbove = false;
            } else {
                cell.isHeader = false;
            }

            if (colIndex == 0) {
                cell.spanLeft = false;
            }

            cell.format.useBorderBox = true;
        })
    );

    // Move blocks from spanned cell to its main cell if any,
    // and remove rows/columns if all cells in it are spanned
    const colCount = table.cells[0]?.length || 0;

    for (let colIndex = colCount - 1; colIndex > 0; colIndex--) {
        table.cells.forEach(row => {
            const cell = row[colIndex];
            const leftCell = row[colIndex - 1];
            if (cell && leftCell && cell.spanLeft) {
                tryMoveBlocks(leftCell, cell);
                leftCell.format.width = leftCell.format.width! + cell.format.width! || undefined;
                cell.format.width = 0;
            }
        });

        if (table.cells.every(row => row[colIndex]?.spanLeft)) {
            table.cells.forEach(row => row.splice(colIndex, 1));
        }
    }

    for (let rowIndex = table.cells.length - 1; rowIndex > 0; rowIndex--) {
        const row = table.cells[rowIndex];

        row.forEach((cell, colIndex) => {
            const aboveCell = table.cells[rowIndex - 1]?.[colIndex];
            if (aboveCell && cell.spanAbove) {
                tryMoveBlocks(aboveCell, cell);
                aboveCell.format.height =
                    aboveCell.format.height! + cell.format.height! || undefined;
                cell.format.height = 0;
            }
        });

        if (row.every(cell => cell.spanAbove)) {
            table.cells.splice(rowIndex, 1);
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
        block =>
            block.blockType == ContentModelBlockType.Paragraph &&
            (block.segments.length == 0 ||
                (block.segments.length == 1 &&
                    block.segments[0].segmentType == ContentModelSegmentType.Br))
    );

    if (!onlyHasEmptyOrBr) {
        arrayPush(targetCell.blocks, sourceCell.blocks);
        sourceCell.blocks = [];
    }
}
