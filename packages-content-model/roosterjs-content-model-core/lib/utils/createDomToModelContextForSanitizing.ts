import { containerSizeFormatParser } from '../override/containerSizeFormatParser';
import { createDomToModelContext, parseValueWithUnit } from 'roosterjs-content-model-dom';
import { createPasteEntityProcessor } from '../override/pasteEntityProcessor';
import { createPasteGeneralProcessor } from '../override/pasteGeneralProcessor';
import { DefaultRootFontSize } from '../coreApi/createEditorContext';
import { getRootComputedStyle } from './getRootComputedStyle';
import { pasteBlockEntityParser } from '../override/pasteCopyBlockEntityParser';
import { pasteDisplayFormatParser } from '../override/pasteDisplayFormatParser';
import { pasteTextProcessor } from '../override/pasteTextProcessor';
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

    const computedFontStyle =
        parseValueWithUnit(getRootComputedStyle(document)?.fontSize) || DefaultRootFontSize;

    return createDomToModelContext(
        {
            defaultFormat,
            rootFontSize: computedFontStyle,
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
