import { ChangeSource } from '../constants/ChangeSource';
import { getSelectedSegments } from '../publicApi/selection/collectSelections';
import { mergeModel } from '../publicApi/model/mergeModel';
import { GetContentMode, PasteType as OldPasteType, PluginEventType } from 'roosterjs-editor-types';
import type { BeforePasteEvent } from 'roosterjs-editor-types';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    FormatWithContentModelContext,
    InsertPoint,
    PasteType,
    ContentModelBeforePasteEventData,
    ContentModelBeforePasteEvent,
    ClipboardData,
    Paste,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';
import {
    AllowedEntityClasses,
    applySegmentFormatToElement,
    createDomToModelContext,
    domToContentModel,
    moveChildNodes,
    tableProcessor,
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
 * @internal
 * Paste into editor using a clipboardData object
 * @param core The StandaloneEditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 */
export const paste: Paste = (
    core: StandaloneEditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType = 'normal'
) => {
    if (clipboardData.snapshotBeforePaste) {
        // Restore original content before paste a new one
        core.api.setContent(
            core,
            clipboardData.snapshotBeforePaste,
            true /* triggerContentChangedEvent */
        );
    } else {
        clipboardData.snapshotBeforePaste = core.api.getContent(
            core,
            GetContentMode.RawHTMLWithSelection
        );
    }

    core.api.focus(core);
    let originalFormat: ContentModelSegmentFormat | undefined;

    core.api.formatContentModel(
        core,
        (model, context) => {
            const eventData = createBeforePasteEventData(core, clipboardData, pasteType);
            const currentSegment = getSelectedSegments(model, true /*includingFormatHolder*/)[0];
            const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
                currentSegment?.format ?? {};
            const {
                domToModelOption,
                fragment,
                customizedMerge,
            } = triggerPluginEventAndCreatePasteFragment(
                core,
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
};

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
    core: StandaloneEditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType
): ContentModelBeforePasteEventData {
    const options = createDefaultHtmlSanitizerOptions();

    options.additionalAllowedCssClasses.push(...AllowedEntityClasses);

    // Remove "caret-color" style generated by Safari to make sure caret shows in right color after paste
    options.cssStyleCallbacks['caret-color'] = () => false;

    return {
        clipboardData,
        fragment: core.contentDiv.ownerDocument.createDocumentFragment(),
        sanitizingOption: options,
        htmlBefore: '',
        htmlAfter: '',
        htmlAttributes: {},
        domToModelOption: Object.assign(
            {},
            ...[
                core.defaultDomToModelOptions,
                {
                    processorOverride: {
                        table: tableProcessor,
                    },
                },
            ]
        ),
        pasteType: PasteTypeMap[pasteType],
    };
}

/**
 * This function is used to create a BeforePasteEvent object after trigger the event, so other plugins can modify the event object
 * This function will also create a DocumentFragment for paste.
 */
function triggerPluginEventAndCreatePasteFragment(
    core: StandaloneEditorCore,
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
    const trustedHTMLHandler = core.trustedHTMLHandler;

    const doc: Document | undefined = rawHtml
        ? new DOMParser().parseFromString(trustedHTMLHandler(rawHtml), 'text/html')
        : undefined;

    // Step 2: Retrieve Metadata from Html and the Html that was copied.
    retrieveMetadataFromClipboard(doc, event as BeforePasteEvent, trustedHTMLHandler);

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

    // Step 4: Trigger BeforePasteEvent so that plugins can do proper change before paste, when the type of paste is different than Plain Text
    if (pasteType !== 'asPlainText') {
        core.api.triggerEvent(core, event, true /* broadcast */);
    }

    // Step 5. Sanitize the fragment before paste to make sure the content is safe
    sanitizePasteContent(event, null /*position*/);

    return event;
}
