import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    BeforePasteEvent,
    ClipboardData,
    DomToModelOptionForSanitizing,
    PasteType,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function generatePasteOptionFromPlugins(
    editor: IEditor,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    htmlFromClipboard: HtmlFromClipboard,
    pasteType: PasteType
): BeforePasteEvent {
    const event: BeforePasteEvent = {
        eventType: 'beforePaste',
        clipboardData,
        fragment,
        htmlBefore: htmlFromClipboard.htmlBefore ?? '',
        htmlAfter: htmlFromClipboard.htmlAfter ?? '',
        htmlAttributes: htmlFromClipboard.metadata,
        pasteType: pasteType,
        domToModelOption: createDomToModelOption(editor),
        containsBlockElements: !!htmlFromClipboard.containsBlockElements,
    };

    return pasteType == 'asPlainText'
        ? event
        : editor.triggerEvent('beforePaste', event, true /* broadcast */);
}
function createDomToModelOption(editor: IEditor): DomToModelOptionForSanitizing {
    const pasteDomToModel = editor.getEnvironment().domToModelSettings.paste;
    const emptyDomToModelOption: Readonly<DomToModelOptionForSanitizing> = {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
        styleSanitizers: {},
        attributeSanitizers: {},
    };
    return Object.assign({}, emptyDomToModelOption, pasteDomToModel);
}
