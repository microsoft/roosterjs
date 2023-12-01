import { ChangeSource } from '../../constants/ChangeSource';
import { GetContentMode, PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import { getSelectedSegments } from '../selection/collectSelections';
import { mergeModel } from './mergeModel';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    FormatWithContentModelContext,
    InsertPoint,
    PasteType,
    ContentModelBeforePasteEventData,
    ContentModelBeforePasteEvent,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';
import type { ClipboardData, IEditor } from 'roosterjs-editor-types';
import {
    AllowedEntityClasses,
    applySegmentFormatToElement,
    createDomToModelContext,
    domToContentModel,
    moveChildNodes,
} from 'roosterjs-content-model-dom';
import {
    createDefaultHtmlSanitizerOptions,
    handleImagePaste,
    handleTextPaste,
    retrieveMetadataFromClipboard,
    sanitizePasteContent,
} from 'roosterjs-editor-dom';

// Map new PasteType to old PasteType
// TODO: We can remove this once we have standalone editor
const PasteTypeMap: Record<PasteType, OldPasteType> = {
    asImage: OldPasteType.AsImage,
    asPlainText: OldPasteType.AsPlainText,
    mergeFormat: OldPasteType.MergeFormat,
    normal: OldPasteType.Normal,
};
const EmptySegmentFormat: Required<ContentModelSegmentFormat> = {
    backgroundColor: '',
    fontFamily: '',
    fontSize: '',
    fontWeight: '',
    italic: false,
    letterSpacing: '',
    lineHeight: '',
    strikethrough: false,
    superOrSubScriptSequence: '',
    textColor: '',
    underline: false,
};

/**
 * Paste into editor using a clipboardData object
 * @param editor The editor to paste content into
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 */
export function paste(
    editor: IStandaloneEditor & IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal'
) {
    if (clipboardData.snapshotBeforePaste) {
        // Restore original content before paste a new one
        editor.setContent(clipboardData.snapshotBeforePaste);
    } else {
        clipboardData.snapshotBeforePaste = editor.getContent(GetContentMode.RawHTMLWithSelection);
    }

    editor.focus();
    let originalFormat: ContentModelSegmentFormat | undefined;

    editor.formatContentModel(
        (model, context) => {
            const eventData = createBeforePasteEventData(editor, clipboardData, pasteType);
            const currentSegment = getSelectedSegments(model, true /*includingFormatHolder*/)[0];
            const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
                currentSegment?.format ?? {};
            const {
                domToModelOption,
                fragment,
                customizedMerge,
            } = triggerPluginEventAndCreatePasteFragment(
                editor,
                clipboardData,
                pasteType,
                eventData,
                { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight }
            );

            const pasteModel = domToContentModel(
                fragment,
                createDomToModelContext(undefined /*editorContext*/, domToModelOption)
            );

            const insertPoint = mergePasteContent(
                model,
                context,
                pasteModel,
                pasteType == 'mergeFormat',
                customizedMerge
            );

            if (insertPoint) {
                originalFormat = insertPoint.marker.format;
            }

            if (originalFormat) {
                context.newPendingFormat = {
                    ...EmptySegmentFormat,
                    ...model.format,
                    ...originalFormat,
                }; // Use empty format as initial value to clear any other format inherits from pasted content
            }

            return true;
        },

        {
            changeSource: ChangeSource.Paste,
            getChangeData: () => clipboardData,
            apiName: 'paste',
        }
    );
}

/**
 * @internal
 * Export only for unit test
 */
export function mergePasteContent(
    model: ContentModelDocument,
    context: FormatWithContentModelContext,
    pasteModel: ContentModelDocument,
    applyCurrentFormat: boolean,
    customizedMerge:
        | undefined
        | ((source: ContentModelDocument, target: ContentModelDocument) => InsertPoint | null)
): InsertPoint | null {
    return customizedMerge
        ? customizedMerge(model, pasteModel)
        : mergeModel(model, pasteModel, context, {
              mergeFormat: applyCurrentFormat ? 'keepSourceEmphasisFormat' : 'none',
              mergeTable: shouldMergeTable(pasteModel),
          });
}

function shouldMergeTable(pasteModel: ContentModelDocument): boolean | undefined {
    // If model contains a table and a paragraph element after the table with a single BR segment, remove the Paragraph after the table
    if (
        pasteModel.blocks.length == 2 &&
        pasteModel.blocks[0].blockType === 'Table' &&
        pasteModel.blocks[1].blockType === 'Paragraph' &&
        pasteModel.blocks[1].segments.length === 1 &&
        pasteModel.blocks[1].segments[0].segmentType === 'Br'
    ) {
        pasteModel.blocks.splice(1);
    }
    // Only merge table when the document contain a single table.
    return pasteModel.blocks.length === 1 && pasteModel.blocks[0].blockType === 'Table';
}

function createBeforePasteEventData(
    editor: IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType
): ContentModelBeforePasteEventData {
    const options = createDefaultHtmlSanitizerOptions();

    options.additionalAllowedCssClasses.push(...AllowedEntityClasses);

    // Remove "caret-color" style generated by Safari to make sure caret shows in right color after paste
    options.cssStyleCallbacks['caret-color'] = () => false;

    return {
        clipboardData,
        fragment: editor.getDocument().createDocumentFragment(),
        sanitizingOption: options,
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        domToModelOption: {},
        pasteType: PasteTypeMap[pasteType],
    };
}

/**
 * This function is used to create a BeforePasteEvent object after trigger the event, so other plugins can modify the event object
 * This function will also create a DocumentFragment for paste.
 */
function triggerPluginEventAndCreatePasteFragment(
    editor: IEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType,
    eventData: ContentModelBeforePasteEventData,
    currentFormat: ContentModelSegmentFormat
): ContentModelBeforePasteEventData {
    const event = {
        eventType: PluginEventType.BeforePaste,
        ...eventData,
    } as ContentModelBeforePasteEvent;

    const { fragment } = event;
    const { rawHtml, text, imageDataUri } = clipboardData;
    const trustedHTMLHandler = editor.getTrustedHTMLHandler();

    const doc: Document | undefined = rawHtml
        ? new DOMParser().parseFromString(trustedHTMLHandler(rawHtml), 'text/html')
        : undefined;

    // Step 2: Retrieve Metadata from Html and the Html that was copied.
    retrieveMetadataFromClipboard(doc, event, trustedHTMLHandler);

    // Step 3: Fill the BeforePasteEvent object, especially the fragment for paste
    if (
        (pasteType == 'asImage' && imageDataUri) ||
        (pasteType != 'asPlainText' && !text && imageDataUri)
    ) {
        // Paste image
        handleImagePaste(imageDataUri, fragment);
    } else if (pasteType != 'asPlainText' && rawHtml && doc ? doc.body : false) {
        moveChildNodes(fragment, doc?.body);
    } else if (text) {
        // Paste text
        handleTextPaste(text, null /*position*/, fragment);
    }

    const formatContainer = fragment.ownerDocument.createElement('span');

    moveChildNodes(formatContainer, fragment);
    fragment.appendChild(formatContainer);

    applySegmentFormatToElement(formatContainer, currentFormat);

    let pluginEvent: ContentModelBeforePasteEvent = event;

    // Step 4: Trigger BeforePasteEvent so that plugins can do proper change before paste, when the type of paste is different than Plain Text
    if (pasteType !== 'asPlainText') {
        pluginEvent = editor.triggerPluginEvent(
            PluginEventType.BeforePaste,
            event,
            true /* broadcast */
        ) as ContentModelBeforePasteEvent;
    }

    // Step 5. Sanitize the fragment before paste to make sure the content is safe
    sanitizePasteContent(event, null /*position*/);

    return pluginEvent;
}
