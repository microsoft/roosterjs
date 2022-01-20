import { ITableSelectionRange, SelectionRangeTypes } from 'roosterjs-editor-types';
import { VTable } from '..';

export default class TableSelectionRange implements ITableSelectionRange {
    constructor(
        tableElement: HTMLTableElement | HTMLTableCellElement,
        startRange: number[],
        endRange: number[]
    ) {
        this.vTable = new VTable(tableElement);
        this.vTable.startRange = startRange;
        this.vTable.endRange = endRange;

        this.ranges = this.vTable.getSelectedRanges();
    }
    vTable: VTable;
    type: SelectionRangeTypes.VSelection;

    ranges: Range[];

    isCollapsed = () => {
        return this.ranges.length == 1 && this.ranges[0].collapsed;
    };
}
