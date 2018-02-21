import PositionInterface from './PositionInterface';

interface SelectionRangeBaseInterface {
    readonly start: PositionInterface;
    readonly end: PositionInterface;
    readonly collapsed: boolean;
    toRange: () => Range;
    normalize: () => SelectionRangeBaseInterface;
}

export default SelectionRangeBaseInterface;
