import { PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import type { HtmlFromClipboard } from './retrieveHtml';
import type {
    ClipboardData,
    ContentModelBeforePasteEvent,
    ContentModelBeforePasteEventData,
    DomToModelOptionForPaste,
    IStandaloneEditor,
    PasteType,
} from 'roosterjs-content-model-types';

// Map new PasteType to old PasteType
// TODO: We can remove this once we have standalone editor
const PasteTypeMap: Record<PasteType, OldPasteType> = {
    asImage: OldPasteType.AsImage,
    asPlainText: OldPasteType.AsPlainText,
    mergeFormat: OldPasteType.MergeFormat,
    normal: OldPasteType.Normal,
};

/**
 * @internal
 */
export function triggerBeforePasteEvent(
    editor: IStandaloneEditor,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    outboundHtml: HtmlFromClipboard,
    htmlAttributes: Record<string, string>,
    pasteType: PasteType
) {
    const domToModelOption: DomToModelOptionForPaste = {
        additionalAllowedTagsInLowerCase: [],
        additionalDisallowedTagsInLowerCase: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
    };

    let event: ContentModelBeforePasteEventData = {
        clipboardData,
        fragment,
        htmlBefore: outboundHtml.htmlBefore ?? '',
        htmlAfter: outboundHtml.htmlAfter ?? '',
        htmlAttributes,
        pasteType: PasteTypeMap[pasteType],
        domToModelOption,

        // Deprecated
        sanitizingOption: {
            elementCallbacks: {},
            attributeCallbacks: {},
            cssStyleCallbacks: {},
            additionalTagReplacements: {},
            additionalAllowedAttributes: [],
            additionalAllowedCssClasses: [],
            additionalDefaultStyleValues: {},
            additionalGlobalStyleNodes: [],
            additionalPredefinedCssForElement: {},
            preserveHtmlComments: false,
            unknownTagReplacement: null,
        },
    };

    if (pasteType !== 'asPlainText') {
        event = editor.triggerPluginEvent(
            PluginEventType.BeforePaste,
            event,
            true /* broadcast */
        ) as ContentModelBeforePasteEvent;
    }

    return event;
}
