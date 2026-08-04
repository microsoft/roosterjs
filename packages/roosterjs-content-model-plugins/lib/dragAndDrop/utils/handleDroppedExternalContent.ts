import { cleanForbiddenElements } from './cleanForbiddenElements';
import {
    createDomToModelContext,
    domToContentModel,
    getNodePositionFromEvent,
    mergeModel,
    textToFragment,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handle dropped HTML content by inserting it at the drop position
 */
export function handleDroppedExternalContent(
    editor: IEditor,
    event: DragEvent,
    droppedContent: string,
    forbiddenElements: string[],
    isPlainText: boolean
): void {
    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);

    if (domPosition) {
        event.preventDefault();
        event.stopPropagation();

        const range = doc.createRange();
        range.setStart(domPosition.node, domPosition.offset);
        range.collapse(true);
        let droppedHTML: HTMLElement | DocumentFragment;
        if (isPlainText) {
            droppedHTML = textToFragment(droppedContent, doc);
        } else {
            const parsedHtml = editor.getDOMCreator().htmlToDOM(droppedContent);
            cleanForbiddenElements(parsedHtml, forbiddenElements);
            droppedHTML = parsedHtml.body;
        }

        const droppedModel = domToContentModel(droppedHTML, createDomToModelContext());

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
