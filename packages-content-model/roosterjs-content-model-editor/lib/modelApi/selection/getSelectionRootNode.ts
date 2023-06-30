import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function getSelectionRootNode(rangeEx: SelectionRangeEx | undefined): Node | undefined {
    return !rangeEx
        ? undefined
        : rangeEx.type == SelectionRangeTypes.Normal
        ? rangeEx.ranges[0]?.commonAncestorContainer
        : rangeEx.type == SelectionRangeTypes.TableSelection
        ? rangeEx.table
        : rangeEx.type == SelectionRangeTypes.ImageSelection
        ? rangeEx.image
        : undefined;
}
