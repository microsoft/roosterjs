import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    BeforePasteEvent,
    ClipboardData,
    DomToModelOptionForSanitizing,
    PasteType,
    IEditor,
} from 'roosterjs-content-model-types';

const emptyDomToModelOption: Readonly<DomToModelOptionForSanitizing> = {
    additionalAllowedTags: [],
    additionalDisallowedTags: [],
    additionalFormatParsers: {},
    formatParserOverride: {},
    processorOverride: {},
    styleSanitizers: {},
    attributeSanitizers: {},
};

/**
 * @internal
 */
export function generatePasteOptionFromPlugins(
    editor: IEditor,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    htmlFromClipboard: HtmlFromClipboard,
    pasteType: PasteType,
    domToModelOption: Readonly<Partial<DomToModelOptionForSanitizing>>
): BeforePasteEvent {
    const event: BeforePasteEvent = {
        eventType: 'beforePaste',
        clipboardData,
        fragment,
        htmlBefore: htmlFromClipboard.htmlBefore ?? '',
        htmlAfter: htmlFromClipboard.htmlAfter ?? '',
        htmlAttributes: htmlFromClipboard.metadata,
        pasteType: pasteType,
        domToModelOption: Object.assign({}, emptyDomToModelOption, domToModelOption),
        containsBlockElements: !!htmlFromClipboard.containsBlockElements,
    };

    return pasteType == 'asPlainText'
        ? event
        : editor.triggerEvent('beforePaste', event, true /* broadcast */);
}
