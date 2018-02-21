import { SelectionRangeBaseInterface, PositionInterface } from 'roosterjs-editor-types';

export default class SelectionRangeBase implements SelectionRangeBaseInterface {
    readonly collapsed: boolean;

    constructor(public readonly start: PositionInterface, public readonly end: PositionInterface = null) {
        this.end = end || start;
        this.collapsed = start.node == end.node && start.offset == end.offset;
    }

    toRange(): Range {
        let document = this.start.node.ownerDocument;
        let range = document.createRange();
        range.setStart(this.start.node, this.start.offset);
        range.setEnd(this.end.node, this.end.offset);
        return range;
    }

    normalize(): SelectionRangeBaseInterface {
        return new SelectionRangeBase(
            this.start.normalize(),
            this.end.normalize()
        )
    }
}
