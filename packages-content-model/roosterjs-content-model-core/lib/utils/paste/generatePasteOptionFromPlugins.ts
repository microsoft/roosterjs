import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    ClipboardData,
    BeforePasteEvent,
    DomToModelOptionForPaste,
    PasteType,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function generatePasteOptionFromPlugins(
    core: StandaloneEditorCore,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    htmlFromClipboard: HtmlFromClipboard,
    pasteType: PasteType
): BeforePasteEvent {
    const domToModelOption: DomToModelOptionForPaste = {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
    };

    const event: BeforePasteEvent = {
        eventType: 'beforePaste',
        clipboardData,
        fragment,
        htmlBefore: htmlFromClipboard.htmlBefore ?? '',
        htmlAfter: htmlFromClipboard.htmlAfter ?? '',
        htmlAttributes: htmlFromClipboard.metadata,
        pasteType: pasteType,
        domToModelOption,
    };

    if (pasteType !== 'asPlainText') {
        core.api.triggerEvent(core, event, true /* broadcast */);
    }

    return event;
}
