import VTable from '../table/VTable';

/**
 * Set the table selected range by adding a background color style
 * @param table the table
 * @param firstTDSelected first table cell of the range
 * @param lastTDSelected last table cell of the range
 */
export default function setTableSelectedRange(
    table: HTMLTableElement,
    firstTDSelected: HTMLElement,
    lastTDSelected: HTMLElement
) {
    if (firstTDSelected && !lastTDSelected) {
        lastTDSelected = firstTDSelected;
    }
    let vTable = new VTable(table);
    let start: number[] = [];
    let end: number[] = [];
    vTable.forEachCell((cell, x, y) => {
        if (cell.td) {
            if (cell.td == firstTDSelected) {
                start[0] = x;
                start[1] = y;
            }

            if (cell.td == lastTDSelected) {
                end[0] = x;
                end[1] = y;
            }
        }
    });
    if (start && end) {
        vTable.highlightSelection(start, end);
    }
}
