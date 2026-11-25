import { cleanForbiddenElements } from './cleanForbiddenElements';
import { createModelFromHtml } from 'roosterjs-content-model-core';
import {
    createDomToModelContext,
    createPasteFragment,
    domToContentModel,
    extractClipboardItems,
    getNodePositionFromEvent,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    DOMCreator,
    DomToModelOptionForSanitizing,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Handle dropped HTML content by inserting it at the drop position
 */
export async function handleDroppedExternalContent(
    editor: IEditor,
    event: DragEvent,
    forbiddenElements: string[],
    domToModelForSanitizing?: Partial<DomToModelOptionForSanitizing>
): Promise<void> {
    const items = getSupportedItems(event.dataTransfer);
    if (items.length == 0) {
        return;
    }

    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);

    if (domPosition) {
        event.preventDefault();
        event.stopPropagation();

        const droppedModel = await getDroppedModel(
            editor,
            items,
            forbiddenElements,
            domToModelForSanitizing
        );
        if (!droppedModel) {
            return;
        }

        const range = doc.createRange();
        range.setStart(domPosition.node, domPosition.offset);
        range.collapse(true);

        editor.formatContentModel(
            (model, context) => {
                mergeModel(model, droppedModel, context, {
                    mergeParagraphAfterList: true,
                });
                return true;
            },
            {
                selectionOverride: {
                    type: 'range',
                    range,
                    isReverted: false,
                },
            }
        );
    }
}

async function getDroppedModel(
    editor: IEditor,
    items: DataTransferItem[],
    forbiddenElements: string[],
    domToModelForSanitizing?: Partial<DomToModelOptionForSanitizing>
): Promise<ContentModelDocument | undefined> {
    const clipboardData = await extractClipboardItems(items, undefined);

    if (clipboardData.rawHtml) {
        const editorDomCreator = editor.getDOMCreator();
        const domCreator: DOMCreator = {
            ...editorDomCreator,
            htmlToDOM: (html: string) => {
                const doc = editorDomCreator.htmlToDOM(html);
                cleanForbiddenElements(doc, forbiddenElements);
                return doc;
            },
        };

        return createModelFromHtml(clipboardData.rawHtml, domToModelForSanitizing, domCreator);
    }

    const fragment = createPasteFragment(
        editor.getDocument(),
        clipboardData,
        'normal',
        undefined /* root */
    );

    return domToContentModel(fragment, createDomToModelContext());
}

function getSupportedItems(dataTransfer: DataTransfer | null): DataTransferItem[] {
    const result: DataTransferItem[] = [];

    for (let i = 0; i < (dataTransfer?.items.length ?? 0); i++) {
        const item = dataTransfer!.items[i];
        if (
            (item.kind == 'string' &&
                (item.type == 'text/html' ||
                    item.type == 'text/plain' ||
                    item.type == 'text/uri-list')) ||
            (item.kind == 'file' && item.type.indexOf('image/') == 0)
        ) {
            result.push(item);
        }
    }

    return result;
}
