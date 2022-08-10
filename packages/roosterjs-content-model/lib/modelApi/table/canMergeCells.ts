import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';

export function canMergeCells(
    cells: ContentModelTableCell[][],
    firstRow: number,
    firstCol: number,
    lastRow: number,
    lastCol: number
): boolean {
    const noSpanAbove = cells[firstRow].every(cell => !cell.spanAbove);
    const noSpanLeft = cells.every(row => !row[firstCol].spanLeft);

    const noDifferentBelowSpan = cells[lastRow]
        .map((_, colIndex) =>
            colIndex >= firstCol && colIndex <= lastCol
                ? getBelowSpanCount(cells, lastRow, colIndex)
                : -1
        )
        .every((x, _, a) => x < 0 || x == a[firstCol]);
    const noDifferentRightSpan = cells
        .map((_, rowIndex) =>
            rowIndex >= firstRow && rowIndex <= lastRow
                ? getRightSpanCount(cells, rowIndex, lastCol)
                : -1
        )
        .every((x, _, a) => x < 0 || x == a[firstRow]);

    return noSpanAbove && noSpanLeft && noDifferentBelowSpan && noDifferentRightSpan;
}

function getBelowSpanCount(cells: ContentModelTableCell[][], rowIndex: number, colIndex: number) {
    let spanCount = 0;

    for (let row = rowIndex + 1; row < cells.length; row++) {
        if (cells[row][colIndex]?.spanAbove) {
            spanCount++;
        } else {
            break;
        }
    }

    return spanCount;
}

function getRightSpanCount(cells: ContentModelTableCell[][], rowIndex: number, colIndex: number) {
    let spanCount = 0;

    for (let col = colIndex + 1; col < cells[rowIndex]?.length; col++) {
        if (cells[rowIndex]?.[col]?.spanLeft) {
            spanCount++;
        } else {
            break;
        }
    }

    return spanCount;
}
