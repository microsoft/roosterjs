import { SelectionRangeInterface, PositionInterface } from 'roosterjs-editor-types';
import Position from './Position';

export default class SelectionRange implements SelectionRangeInterface {
    readonly collapsed: boolean;
    readonly start: PositionInterface;
    readonly end: PositionInterface;
    private rawRange: Range;

    constructor(rawRange: Range);
    constructor(start: PositionInterface, end?: PositionInterface);

    constructor(startOrRawRange: PositionInterface | Range, end?: PositionInterface) {
        if (startOrRawRange instanceof Range) {
            this.rawRange = startOrRawRange;
            this.start = new Position(startOrRawRange.startContainer, startOrRawRange.startOffset);
            this.end = new Position(startOrRawRange.endContainer, startOrRawRange.endOffset);
        } else {
            this.start = startOrRawRange;
            this.end = end || this.start;
        }
        this.collapsed = this.start.node == this.end.node && this.start.offset == this.end.offset;
    }

    getRange(): Range {
        if (!this.rawRange) {
            let document = this.start.node.ownerDocument;
            this.rawRange = document.createRange();
            this.rawRange.setStart(this.start.node, this.start.offset);
            this.rawRange.setEnd(this.end.node, this.end.offset);
        }
        return this.rawRange;
    }

    normalize(): SelectionRangeInterface {
        return new SelectionRange(
            this.start.normalize(),
            this.end.normalize()
        )
    }
}
