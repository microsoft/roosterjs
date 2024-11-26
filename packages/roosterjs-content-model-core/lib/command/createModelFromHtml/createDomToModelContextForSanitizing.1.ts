import { containerSizeFormatParser } from 'roosterjs-content-model-core/lib/override/containerSizeFormatParser';
import { createDomToModelContext } from 'roosterjs-content-model-dom/lib';
import { createPasteEntityProcessor } from 'roosterjs-content-model-core/lib/override/pasteEntityProcessor';
import { createPasteGeneralProcessor } from 'roosterjs-content-model-core/lib/override/pasteGeneralProcessor';
import { DefaultSanitizingOption } from './createDomToModelContextForSanitizing';
import { getRootComputedStyleForContext } from 'roosterjs-content-model-core/lib/coreApi/createEditorContext/getRootComputedStyleForContext';
import { pasteBlockEntityParser } from 'roosterjs-content-model-core/lib/override/pasteCopyBlockEntityParser';
import { pasteDisplayFormatParser } from 'roosterjs-content-model-core/lib/override/pasteDisplayFormatParser';
import { pasteTextProcessor } from 'roosterjs-content-model-core/lib/override/pasteTextProcessor';
import type {
    ContentModelSegmentFormat,
    DomToModelOption,
    DomToModelOptionForSanitizing,
    DomToModelContext,
} from 'roosterjs-content-model-types/lib';

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
            experimentalFeatures: [],
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
                whiteSpace: (format, element, context, defaultStyle) => {
                    if (element.style.whiteSpace != 'pre') {
                        context.defaultFormatParsers.whiteSpace?.(
                            format,
                            element,
                            context,
                            defaultStyle
                        );
                    }
                },
            },
            additionalFormatParsers: {
                container: [containerSizeFormatParser],
                entity: [pasteBlockEntityParser],
            },
        },
        sanitizingOption
    );
}
