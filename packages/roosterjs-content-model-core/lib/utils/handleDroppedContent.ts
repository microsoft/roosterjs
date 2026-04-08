import { cleanForbiddenElements } from './cleanForbiddenElements';
import {
    createDomToModelContext,
    domToContentModel,
    getNodePositionFromEvent,
    mergeModel,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handle dropped HTML content by inserting it at the drop position
 */
export function handleDroppedContent(
    editor: IEditor,
    event: DragEvent,
    html: string,
    forbiddenElements: string[]
): void {
    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);

    if (domPosition) {
        event.preventDefault();
        event.stopPropagation();

        const range = doc.createRange();
        range.setStart(domPosition.node, domPosition.offset);
        range.collapse(true);

        const parsedHtml = editor.getDOMCreator().htmlToDOM(html);
        cleanForbiddenElements(parsedHtml, forbiddenElements);

        const droppedModel = domToContentModel(parsedHtml.body, createDomToModelContext());

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
