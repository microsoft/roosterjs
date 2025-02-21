import type { BeforePasteEvent, ClipboardData } from 'roosterjs-content-model-types';

export function createBeforePasteEventMock(
    fragment: DocumentFragment,
    htmlBefore: string = ''
): BeforePasteEvent {
    return {
        eventType: 'beforePaste',
        clipboardData: <ClipboardData>{},
        fragment: fragment,
        htmlBefore,
        htmlAfter: '',
        htmlAttributes: {},
        pasteType: 'normal',
        domToModelOption: {
            additionalAllowedTags: [],
            additionalDisallowedTags: [],
            additionalFormatParsers: {},
            attributeSanitizers: {},
            formatParserOverride: {},
            processorOverride: {},
            styleSanitizers: {},
        },
    };
}
