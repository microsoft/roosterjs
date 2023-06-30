import { defaultFormatParsers, getFormatParsers } from '../../formatHandlers/defaultFormatHandlers';
import { defaultProcessorMap } from './defaultProcessors';
import { defaultStyleMap } from '../../formatHandlers/utils/defaultStyles';
import { DomToModelContext, DomToModelOption, EditorContext } from 'roosterjs-content-model-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types';

/**
 * Create context object form DOM to Content Model conversion
 * @param editorContext Context of editor
 * @param options Options for this context
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    options?: DomToModelOption
): DomToModelContext {
    const context: DomToModelContext = {
        ...editorContext,

        blockFormat: {},
        segmentFormat: {},
        zoomScaleFormat: {},
        isInSelection: false,

        listFormat: {
            levels: [],
            threadItemCounts: [],
        },
        link: {
            format: {},
            dataset: {},
        },
        code: {
            format: {},
        },
        blockDecorator: {
            format: {},
            tagName: '',
        },

        elementProcessors: {
            ...defaultProcessorMap,
            ...(options?.processorOverride || {}),
        },

        defaultStyles: {
            ...defaultStyleMap,
            ...(options?.defaultStyleOverride || {}),
        },

        formatParsers: getFormatParsers(
            options?.formatParserOverride,
            options?.additionalFormatParsers
        ),

        defaultElementProcessors: defaultProcessorMap,
        defaultFormatParsers: defaultFormatParsers,
        allowCacheElement: !options?.disableCacheElement,
    };

    const range = options?.selectionRange;
    let selectionRoot: Node | undefined;

    switch (range?.type) {
        case SelectionRangeTypes.Normal:
            const regularRange = range.ranges[0];
            if (regularRange) {
                selectionRoot = regularRange.commonAncestorContainer;
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
                selectionRoot = range.table;
                context.tableSelection = {
                    table: range.table,
                    firstCell: { ...range.coordinates.firstCell },
                    lastCell: { ...range.coordinates.lastCell },
                };
            }

            break;

        case SelectionRangeTypes.ImageSelection:
            selectionRoot = range.image;
            context.imageSelection = {
                image: range.image,
            };
            break;
    }

    if (selectionRoot) {
        context.selectionRootNode = selectionRoot;
    }

    return context;
}
