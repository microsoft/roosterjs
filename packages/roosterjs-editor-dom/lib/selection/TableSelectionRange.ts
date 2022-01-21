import VTable from '../table/VTable';
import { ITableSelectionRange, SelectionRangeTypes } from 'roosterjs-editor-types';
/**
 * Table selection Range used in the getSelectedRangeEx editor Api
 * Can create a object with an array of ranges depending on a vTable range provided.
 */
export default class TableSelectionRange implements ITableSelectionRange {
    constructor(vTable: VTable) {
        this.vTable = vTable;

        this.ranges = this.vTable.getSelectedRanges();

        this.areAllCollapsed =
            this.ranges.filter(range => range.collapsed).length == this.ranges.length;
    }

    readonly type: SelectionRangeTypes.TableSelection;

    readonly vTable: VTable;

    readonly ranges: Range[];

    readonly areAllCollapsed: boolean;
}
