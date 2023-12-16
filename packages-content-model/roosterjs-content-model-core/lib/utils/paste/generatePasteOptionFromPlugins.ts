import { PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import type { HtmlFromClipboard } from './retrieveHtmlInfo';
import type {
    ClipboardData,
    ContentModelBeforePasteEvent,
    DomToModelOptionForPaste,
    IStandaloneEditor,
    PasteType,
} from 'roosterjs-content-model-types';
import type { MergePasteContentOption } from './mergePasteContent';

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
    editor: IStandaloneEditor,
    clipboardData: ClipboardData,
    fragment: DocumentFragment,
    htmlFromClipboard: HtmlFromClipboard,
    pasteType: PasteType
): MergePasteContentOption {
    const domToModelOption: DomToModelOptionForPaste = {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
    };

    let event: ContentModelBeforePasteEvent = {
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
        event = editor.triggerPluginEvent(
            PluginEventType.BeforePaste,
            event,
            true /* broadcast */
        ) as ContentModelBeforePasteEvent;
    }

    return {
        fragment: event.fragment,
        domToModelOption: event.domToModelOption,
        customizedMerge: event.customizedMerge,
        pasteType: event.pasteType,
    };
}
