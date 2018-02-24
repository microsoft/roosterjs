import PositionInterface from './PositionInterface';

interface SelectionRangeInterface {
    readonly start: PositionInterface;
    readonly end: PositionInterface;
    readonly collapsed: boolean;
    getRange: () => Range;
    normalize: () => SelectionRangeInterface;
}

export default SelectionRangeInterface;
