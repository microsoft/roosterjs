import Position from './Position';

interface SelectionRangeBase {
    readonly start: Position;
    readonly end: Position;
    readonly collapsed: boolean;
}

const SelectionRangeBase = {
    create: createRangeBase,
    toRange: toRange,
};

export default SelectionRangeBase;

interface SelectionRange extends SelectionRangeBase {
    readonly rawRange: Range;
}

const SelectionRange = {
    create: createRange,
};

export { SelectionRange };

function createRangeBase(start: Position, end?: Position): SelectionRangeBase {
    end = end || start;
    return {
        start: start,
        end: end,
        collapsed: start.node == end.node && start.offset == end.offset,
    };
}

function createRange(rawRange: Range): SelectionRange {
    return {
        ...SelectionRangeBase.create(
            Position.create(rawRange.startContainer, rawRange.startOffset),
            Position.create(rawRange.endContainer, rawRange.endOffset)
        ),
        rawRange: rawRange,
    };
}

function toRange(selectionRangeBase: SelectionRangeBase): Range {
    let document = selectionRangeBase.start.node.ownerDocument;
    let range = document.createRange();
    range.setStart(selectionRangeBase.start.node, selectionRangeBase.start.offset);
    range.setEnd(selectionRangeBase.end.node, selectionRangeBase.end.offset);
    return range;
}
