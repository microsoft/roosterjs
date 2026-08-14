import { cleanForbiddenElements } from './cleanForbiddenElements';
import {
    createContentModelDocument,
    createDomToModelContext,
    createImage,
    createParagraph,
    domToContentModel,
    getNodePositionFromEvent,
    mergeModel,
    textToFragment,
} from 'roosterjs-content-model-dom';
import type { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handle dropped HTML content by inserting it at the drop position
 */
export function handleDroppedExternalContent(
    editor: IEditor,
    event: DragEvent,
    forbiddenElements: string[]
): void {
    const droppedModel = getDroppedModel(editor, event, forbiddenElements);
    if (!droppedModel) {
        return;
    }
    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);

    if (domPosition) {
        event.preventDefault();
        event.stopPropagation();

        const range = doc.createRange();
        range.setStart(domPosition.node, domPosition.offset);
        range.collapse(true);

        editor.formatContentModel(
            (model, context) => {
                mergeModel(model, droppedModel, context);
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

function getDroppedModel(
    editor: IEditor,
    dragEvent: DragEvent,
    forbiddenElements: string[]
): ContentModelDocument | undefined {
    const dataTransfer = dragEvent.dataTransfer;
    const types = dataTransfer?.types;

    if (!dataTransfer || !types) {
        return undefined;
    }
    const html = dataTransfer.getData('text/html');
    let text = '';
    const files = dataTransfer.files;

    if (html) {
        const parsedHtml = editor.getDOMCreator().htmlToDOM(html);
        cleanForbiddenElements(parsedHtml, forbiddenElements);
        return domToContentModel(parsedHtml.body, createDomToModelContext());
    } else if ((text = dataTransfer.getData('text/plain'))) {
        const textFragment = textToFragment(text, editor.getDocument());
        return domToContentModel(textFragment, createDomToModelContext());
    } else if (files) {
        const file = files?.length === 1 ? files[0] : undefined;
        if (file?.type.startsWith('image/')) {
            const model = createContentModelDocument();
            const paragraph = createParagraph();
            paragraph.segments.push(createImage(URL.createObjectURL(file)));
            model.blocks.push(paragraph);
            return model;
        }
    }

    return undefined;
}
