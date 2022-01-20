import VTable from '../table/VTable';
import { ITableSelectionRange, SelectionRangeTypes } from 'roosterjs-editor-types';
/**
 * Table selection Range used in the getSelectedRangeEx editor Api
 * Can create a object with an array of ranges depending on a vTable range provided.
 */
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
        this.type = SelectionRangeTypes.VSelection;
    }

    vTable: VTable;
    type: SelectionRangeTypes.VSelection;

    ranges: Range[];

    isCollapsed = () => {
        return this.ranges.length == 1 && this.ranges[0].collapsed;
    };
}
