import { defaultProcessorMap } from './defaultProcessors';
import { defaultStyleMap } from './defaultStyles';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { DomToModelOption } from '../../publicTypes/IExperimentalContentModelEditor';
import { EditorContext } from '../../publicTypes/context/EditorContext';
import { SelectionRangeEx, SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * @internal
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    range?: SelectionRangeEx,
    options?: DomToModelOption
): DomToModelContext {
    const context: DomToModelContext = {
        ...(editorContext || {
            isDarkMode: false,
            zoomScale: 1,
            isRightToLeft: false,
            getDarkColor: undefined,
        }),

        segmentFormat: {},
        isInSelection: false,

        elementProcessors: {
            ...defaultProcessorMap,
            ...(options?.processorOverride || {}),
        },

        defaultStyles: {
            ...defaultStyleMap,
            ...(options?.defaultStyleOverride || {}),
        },
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
