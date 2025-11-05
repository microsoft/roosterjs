import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    BeforePasteEvent,
    ClipboardData,
    DomToModelOptionForSanitizing,
    PasteType,
    IEditor,
    OnNodeCreated,
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
    const domToModelOption: DomToModelOptionForSanitizing = {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
        styleSanitizers: {},
        attributeSanitizers: {},
        processNonVisibleElements: !!editor.getEnvironment().domToModelSettings.customized
            .processNonVisibleElements,
    };

    let onNodeCreated: OnNodeCreated | undefined = undefined;
    const chainOnNodeCreatedCallback = (newOnNodeCreated: OnNodeCreated) => {
        const existingOnNodeCreated = onNodeCreated;
        onNodeCreated = (model, node) => {
            existingOnNodeCreated?.(model, node);
            newOnNodeCreated(model, node);
        };
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
        containsBlockElements: !!htmlFromClipboard.containsBlockElements,
        getOnNodeCreated: () => onNodeCreated,
        chainOnNodeCreatedCallback,
    };

    return editor.triggerEvent('beforePaste', event, true /* broadcast */);
}
