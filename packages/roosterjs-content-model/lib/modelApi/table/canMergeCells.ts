import { ContentModelTableRow } from '../../publicTypes/block/ContentModelTableRow';

/**
 * @internal
 */
export function canMergeCells(
    rows: ContentModelTableRow[],
    firstRow: number,
    firstCol: number,
    lastRow: number,
    lastCol: number
): boolean {
    const noSpanAbove =
        firstCol == lastCol ||
        rows[firstRow].cells.every(
            (cell, colIndex) => colIndex < firstCol || colIndex > lastCol || !cell.spanAbove
        );
    const noSpanLeft =
        firstRow == lastRow ||
        rows.every(
            (row, rowIndex) =>
                rowIndex < firstRow || rowIndex > lastRow || !row.cells[firstCol].spanLeft
        );

    const noDifferentBelowSpan = rows[lastRow].cells
        .map((_, colIndex) =>
            colIndex >= firstCol && colIndex <= lastCol
                ? getBelowSpanCount(rows, lastRow, colIndex)
                : -1
        )
        .every((x, _, a) => x < 0 || x == a[firstCol]);
    const noDifferentRightSpan = rows
        .map((_, rowIndex) =>
            rowIndex >= firstRow && rowIndex <= lastRow
                ? getRightSpanCount(rows, rowIndex, lastCol)
                : -1
        )
        .every((x, _, a) => x < 0 || x == a[firstRow]);

    return noSpanAbove && noSpanLeft && noDifferentBelowSpan && noDifferentRightSpan;
}

function getBelowSpanCount(rows: ContentModelTableRow[], rowIndex: number, colIndex: number) {
    let spanCount = 0;

    for (let row = rowIndex + 1; row < rows.length; row++) {
        if (rows[row]?.cells[colIndex]?.spanAbove) {
            spanCount++;
        } else {
            break;
        }
    }

    return spanCount;
}

function getRightSpanCount(rows: ContentModelTableRow[], rowIndex: number, colIndex: number) {
    let spanCount = 0;

    for (let col = colIndex + 1; col < rows[rowIndex]?.cells.length; col++) {
        if (rows[rowIndex]?.cells[col]?.spanLeft) {
            spanCount++;
        } else {
            break;
        }
    }

    return spanCount;
}
