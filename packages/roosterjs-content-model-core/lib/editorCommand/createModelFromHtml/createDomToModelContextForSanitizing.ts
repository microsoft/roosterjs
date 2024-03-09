import { containerSizeFormatParser } from './containerSizeFormatParser';
import { createDomToModelContext } from 'roosterjs-content-model-dom';
import { createSanitizeEntityProcessor } from './sanitizeEntityProcessor';
import { createSanitizeGeneralProcessor } from './sanitizeGeneralProcessor';
import { getRootComputedStyleForContext } from '../../coreApi/createEditorContext/getRootComputedStyleForContext';
import { sanitizeCopyBlockEntityParser } from './sanitizeCopyBlockEntityParser';
import { sanitizeDisplayFormatParser } from './sanitizeDisplayFormatParser';
import { sanitizeTextProcessor } from './sanitizeTextProcessor';
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
    additionalSanitizingOption?: DomToModelOptionForSanitizing
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
                '#text': sanitizeTextProcessor,
                entity: createSanitizeEntityProcessor(sanitizingOption),
                '*': createSanitizeGeneralProcessor(sanitizingOption),
            },
            formatParserOverride: {
                display: sanitizeDisplayFormatParser,
            },
            additionalFormatParsers: {
                container: [containerSizeFormatParser],
                entity: [sanitizeCopyBlockEntityParser],
            },
        },
        sanitizingOption
    );
}
