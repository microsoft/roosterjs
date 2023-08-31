import { defaultProcessorMap } from './defaultProcessors';
import { DomToModelContext, DomToModelOption, EditorContext } from 'roosterjs-content-model-types';
import { getFormatParsers } from '../../formatHandlers/defaultFormatHandlers';
import { SelectionRangeEx } from 'roosterjs-editor-types';

/**
 * Create context object form DOM to Content Model conversion
 * @param editorContext Context of editor
 * @param options Options for this context
 * @param selection Selection that already exists in content
 */
export function createDomToModelContext(
    editorContext?: EditorContext,
    options?: DomToModelOption,
    selection?: SelectionRangeEx
): DomToModelContext {
    const context: DomToModelContext = {
        ...editorContext,

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

        formatParsers: getFormatParsers(
            options?.formatParserOverride,
            options?.additionalFormatParsers
        ),

        defaultElementProcessors: defaultProcessorMap,
    };

    if (editorContext?.isRootRtl) {
        context.blockFormat.direction = 'rtl';
    }

    if (selection) {
        context.rangeEx = selection;
    }

    return context;
}
