import Position from './Position';
import SelectionRangeBase from './SelectionRangeBase';

export default class SelectionRange extends SelectionRangeBase {
    constructor(public readonly rawRange: Range) {
        super(
            new Position(rawRange.startContainer, rawRange.startOffset),
            new Position(rawRange.endContainer, rawRange.endOffset)
        );
    };
}
