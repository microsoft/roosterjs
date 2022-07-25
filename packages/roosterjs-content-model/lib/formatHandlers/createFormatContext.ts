import { FormatContext } from './FormatContext';
import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createFormatContext(
    isDarkMode: boolean = false,
    zoomScale: number = 1,
    isRightToLeft: boolean = false,
    getDarkColor?: (lightColor: string) => string,
    range?: SelectionRangeEx
): FormatContext {
    const context: FormatContext = {
        isDarkMode,
        zoomScale,
        isRightToLeft,
        getDarkColor,
        isInSelection: false,
    };

    switch (range?.type) {
        case SelectionRangeTypes.Normal:
            const regularRange = range.ranges[0];
            if (regularRange) {
                context.regularSelection = {
                    startContainer: regularRange.startContainer,
                    startOffset: regularRange.startOffset,
                    endContainer: regularRange.endContainer,
                    endOffset: regularRange.endOffset,
                    isSelectionCollapsed: regularRange.collapsed,
                };
            }
            break;

        case SelectionRangeTypes.TableSelection:
            if (range.coordinates) {
                context.tableSelection = {
                    table: range.table,
                    firstCell: { ...range.coordinates.firstCell },
                    lastCell: { ...range.coordinates.lastCell },
                };
            }

            break;
    }

    return context;
}
