import { ContentModelContext } from '../../publicTypes/ContentModelContext';
import { DomToModelContext } from './DomToModelContext';
import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createDomToModelContext(
    contentModelContext?: ContentModelContext,
    range?: SelectionRangeEx
): DomToModelContext {
    const context: DomToModelContext = {
        contentModelContext: contentModelContext || {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
            getDarkColor: undefined,
        },

        segmentFormat: {},
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
            if (range.coordinates && range.table) {
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
