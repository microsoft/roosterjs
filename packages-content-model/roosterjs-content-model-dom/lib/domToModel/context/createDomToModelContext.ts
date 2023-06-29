import { defaultFormatParsers, getFormatParsers } from '../../formatHandlers/defaultFormatHandlers';
import { defaultProcessorMap } from './defaultProcessors';
import { defaultStyleMap } from '../../formatHandlers/utils/defaultStyles';
import {
    DomToModelContext,
    DomToModelOption,
    DomToModelSelectionContext,
    EditorContext,
} from 'roosterjs-content-model-types';

/**
 * Create context object form DOM to Content Model conversion
 * @param editorContext Context of editor
 * @param options Options for this context
 * @param selectionContext Selection that already exists in content
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    options?: DomToModelOption,
    selectionContext?: DomToModelSelectionContext
): DomToModelContext {
    const context: DomToModelContext = {
        ...editorContext,
        ...selectionContext,

        blockFormat: {},
        segmentFormat: {},
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

    if (editorContext?.isRootRtl) {
        context.blockFormat.direction = 'rtl';
    }

    return context;
}
