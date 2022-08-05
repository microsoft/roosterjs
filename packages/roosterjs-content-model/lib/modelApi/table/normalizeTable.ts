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
    table.format.borderCollapse = true;
    table.format.useBorderBox = true;

    // Move blocks from spanned cell to its main cell,
    // and remove rows/columns that all cells in it are spanned
    for (let colIndex = table.cells[0].length - 1; colIndex >= 0; colIndex--) {
        let allSpannedLeft = true;

        for (let rowIndex = 0; rowIndex < table.cells.length; rowIndex++) {
            const cell = table.cells[rowIndex][colIndex];

            if (cell?.spanLeft) {
                tryMoveBlocks(table.cells[rowIndex][colIndex - 1], cell, true /*inSameRow*/);
            } else {
                allSpannedLeft = false;
            }
        }

        if (allSpannedLeft) {
            table.cells.forEach(row => row.splice(colIndex, 1));
        }
    }

    for (let rowIndex = table.cells.length - 1; rowIndex >= 0; rowIndex--) {
        let allSpannedAbove = true;
        const row = table.cells[rowIndex];

        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = row[colIndex];

            if (cell?.spanAbove) {
                tryMoveBlocks(table.cells[rowIndex - 1]?.[colIndex], cell, false /*inSameRow*/);
            } else {
                allSpannedAbove = false;
            }
        }

        if (allSpannedAbove) {
            table.cells.splice(rowIndex, 1);
        }
    }

    for (let i = table.cells.length - 1; i >= 0; i--) {
        if (table.cells[i].every(cell => cell.spanAbove)) {
            table.cells.splice(i, 1);
        }
    }

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
    targetCell: ContentModelTableCell | undefined,
    sourceCell: ContentModelTableCell | undefined,
    isSameRow: boolean
) {
    if (!sourceCell || !targetCell) {
        return;
    }

    if (isSameRow) {
        if (sourceCell.format.width! > 0) {
            targetCell.format.width! += sourceCell.format.width!;
        }
    } else {
        if (sourceCell.format.height! > 0) {
            targetCell.format.height! += sourceCell.format.height!;
        }
    }

    if (sourceCell.blocks.length == 1) {
        const block = sourceCell.blocks[0];

        if (
            block.blockType == ContentModelBlockType.Paragraph &&
            block.segments.length == 1 &&
            block.segments[0].segmentType == ContentModelSegmentType.Br
        ) {
            return;
        }
    }

    arrayPush(targetCell.blocks, sourceCell.blocks);
    sourceCell.blocks = [];
}
