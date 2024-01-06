import { PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    ClipboardData,
    ContentModelBeforePasteEvent,
    DomToModelOptionForPaste,
    PasteType,
    StandaloneEditorCore,
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
export function generatePasteOptionFromPlugins(
    core: StandaloneEditorCore,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    htmlFromClipboard: HtmlFromClipboard,
    pasteType: PasteType
): ContentModelBeforePasteEvent {
    const domToModelOption: DomToModelOptionForPaste = {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
        styleSanitizers: {},
        attributeSanitizers: {},
    };

    const event: ContentModelBeforePasteEvent = {
        eventType: PluginEventType.BeforePaste,
        clipboardData,
        fragment,
        htmlBefore: htmlFromClipboard.htmlBefore ?? '',
        htmlAfter: htmlFromClipboard.htmlAfter ?? '',
        htmlAttributes: htmlFromClipboard.metadata,
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
        core.api.triggerEvent(core, event, true /* broadcast */);
    }

    return event;
}
