import { containerSizeFormatParser } from '../../override/containerSizeFormatParser';
import { createDomToModelContext } from 'roosterjs-content-model-dom';
import { createPasteEntityProcessor } from '../../override/pasteEntityProcessor';
import { createPasteGeneralProcessor } from '../../override/pasteGeneralProcessor';
import { getRootComputedStyleForContext } from '../../coreApi/createEditorContext/getRootComputedStyleForContext';
import { pasteBlockEntityParser } from '../../override/pasteCopyBlockEntityParser';
import { pasteDisplayFormatParser } from '../../override/pasteDisplayFormatParser';
import { pasteTextProcessor } from '../../override/pasteTextProcessor';
import type {
    ContentModelSegmentFormat,
    DomToModelContext,
    DomToModelOption,
    DomToModelOptionForSanitizing,
} from 'roosterjs-content-model-types';

const DefaultSanitizingOption: DomToModelOptionForSanitizing = {
    processorOverride: {},
    formatParserOverride: {},
    additionalFormatParsers: {},
    additionalAllowedTags: [],
    additionalDisallowedTags: [],
    styleSanitizers: {},
    attributeSanitizers: {},
};

/**
 * @internal
 */
export function createDomToModelContextForSanitizing(
    document: Document,
    defaultFormat?: ContentModelSegmentFormat,
    defaultOption?: DomToModelOption,
    additionalSanitizingOption?: Partial<DomToModelOptionForSanitizing>
): DomToModelContext {
    const sanitizingOption: DomToModelOptionForSanitizing = {
        ...DefaultSanitizingOption,
        ...additionalSanitizingOption,
    };

    return createDomToModelContext(
        {
            defaultFormat,
            ...getRootComputedStyleForContext(document),
        },
        defaultOption,
        {
            processorOverride: {
                '#text': pasteTextProcessor,
                entity: createPasteEntityProcessor(sanitizingOption),
                '*': createPasteGeneralProcessor(sanitizingOption),
            },
            formatParserOverride: {
                display: pasteDisplayFormatParser,
            },
            additionalFormatParsers: {
                container: [containerSizeFormatParser],
                entity: [pasteBlockEntityParser],
            },
        },
        sanitizingOption
    );
}
