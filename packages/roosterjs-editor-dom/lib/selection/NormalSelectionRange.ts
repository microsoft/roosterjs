import { INormalSelectionRange, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * Normal selection Range used in the getSelectedRangeEx editor Api
 */
export default class NormalSelectionRange implements INormalSelectionRange {
    constructor(ranges: Range[]) {
        this.ranges = ranges;
        this.type = SelectionRangeTypes.Normal;

        this.areAllCollapsed =
            this.ranges.filter(range => range.collapsed).length == this.ranges.length;
    }

    readonly type: SelectionRangeTypes.Normal;

    readonly ranges: Range[];

    readonly areAllCollapsed: boolean;
}
