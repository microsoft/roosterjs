import getSelectedSegments from '../selection/getSelectedSegments';
import { ChangeSource, GetContentMode, PasteType, PluginEventType } from 'roosterjs-editor-types';
import { formatWithContentModel } from './formatWithContentModel';
import { mergeModel } from '../../modelApi/common/mergeModel';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';
import type { FormatWithContentModelContext } from '../../publicTypes/parameter/FormatWithContentModelContext';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import type { NodePosition } from 'roosterjs-editor-types';
import {
    applySegmentFormatToElement,
    createDomToModelContext,
    domToContentModel,
} from 'roosterjs-content-model-dom';
import type { ContentModelBeforePasteEventData } from '../../publicTypes/event/ContentModelBeforePasteEvent';
import type ContentModelBeforePasteEvent from '../../publicTypes/event/ContentModelBeforePasteEvent';
import {
    createDefaultHtmlSanitizerOptions,
    getPasteType,
    handleImagePaste,
    handleTextPaste,
    moveChildNodes,
    retrieveMetadataFromClipboard,
    sanitizePasteContent,
} from 'roosterjs-editor-dom';
import type { ClipboardData } from 'roosterjs-editor-types';

/**
 * Paste into editor using a clipboardData object
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteAsText Force pasting as plain text. Default value is false
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format.  Default value is false. When pasteAsText is true, this parameter is ignored
 * @param pasteAsImage: When set to true, if the clipboardData contains a imageDataUri will paste the image to the editor
 */
export default function paste(
    editor: IContentModelEditor,
    clipboardData: ClipboardData,
    pasteAsText: boolean = false,
    applyCurrentFormat: boolean = false,
    pasteAsImage: boolean = false
) {
    if (clipboardData.snapshotBeforePaste) {
        // Restore original content before paste a new one
        editor.setContent(clipboardData.snapshotBeforePaste);
    } else {
        clipboardData.snapshotBeforePaste = editor.getContent(GetContentMode.RawHTMLWithSelection);
    }

    formatWithContentModel(
        editor,
        'Paste',
        (model, context) => {
            const eventData = createBeforePasteEventData(
                editor,
                clipboardData,
                getPasteType(pasteAsText, applyCurrentFormat, pasteAsImage)
            );
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
                null /* position */,
                pasteAsText,
                pasteAsImage,
                eventData,
                { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight }
            );

            const pasteModel = domToContentModel(
                fragment,
                createDomToModelContext(undefined /*editorContext*/, domToModelOption)
            );

            mergePasteContent(model, context, pasteModel, applyCurrentFormat, customizedMerge);

            return true;
        },

        {
            changeSource: ChangeSource.Paste,
            getChangeData: () => clipboardData,
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
        | ((source: ContentModelDocument, target: ContentModelDocument) => void)
) {
    if (customizedMerge) {
        customizedMerge(model, pasteModel);
    } else {
        mergeModel(model, pasteModel, context, {
            mergeFormat: applyCurrentFormat ? 'keepSourceEmphasisFormat' : 'none',
            mergeTable: shouldMergeTable(pasteModel),
        });
    }
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
    editor: IContentModelEditor,
    clipboardData: ClipboardData,
    pasteType: PasteType
): ContentModelBeforePasteEventData {
    const options = createDefaultHtmlSanitizerOptions();

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
        pasteType,
    };
}

/**
 * This function is used to create a BeforePasteEvent object after trigger the event, so other plugins can modify the event object
 * This function will also create a DocumentFragment for paste.
 */
function triggerPluginEventAndCreatePasteFragment(
    editor: IContentModelEditor,
    clipboardData: ClipboardData,
    position: NodePosition | null,
    pasteAsText: boolean,
    pasteAsImage: boolean,
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

    let doc: Document | undefined = rawHtml
        ? new DOMParser().parseFromString(trustedHTMLHandler(rawHtml), 'text/html')
        : undefined;

    // Step 2: Retrieve Metadata from Html and the Html that was copied.
    retrieveMetadataFromClipboard(doc, event, trustedHTMLHandler);

    // Step 3: Fill the BeforePasteEvent object, especially the fragment for paste
    if ((pasteAsImage && imageDataUri) || (!pasteAsText && !text && imageDataUri)) {
        // Paste image
        handleImagePaste(imageDataUri, fragment);
    } else if (!pasteAsText && rawHtml && doc ? doc.body : false) {
        moveChildNodes(fragment, doc?.body);
    } else if (text) {
        // Paste text
        handleTextPaste(text, position, fragment);
    }

    const formatContainer = fragment.ownerDocument.createElement('span');

    moveChildNodes(formatContainer, fragment);
    fragment.appendChild(formatContainer);

    applySegmentFormatToElement(formatContainer, currentFormat);

    let pluginEvent: ContentModelBeforePasteEvent = event;
    // Step 4: Trigger BeforePasteEvent so that plugins can do proper change before paste, when the type of paste is different than Plain Text
    if (event.pasteType !== PasteType.AsPlainText) {
        pluginEvent = editor.triggerPluginEvent(
            PluginEventType.BeforePaste,
            event,
            true /* broadcast */
        ) as ContentModelBeforePasteEvent;
    }

    // Step 5. Sanitize the fragment before paste to make sure the content is safe
    sanitizePasteContent(event, position);

    return pluginEvent;
}
