import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api';
import {
    createSelectionMarker,
    deleteSelection,
    getNodePositionFromEvent,
    mergeModel,
    mutateBlock,
    normalizeContentModel,
    setSelection,
} from 'roosterjs-content-model-dom';
import type { ContentModelDocument, IEditor } from 'roosterjs-content-model-types';

/**
 * @internal
 * Handle dropped internal HTML content by inserting it at the drop position
 */
export function handleDroppedInternalContent(
    editor: IEditor,
    event: DragEvent,
    droppedModel: ContentModelDocument
): void {
    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);

    if (domPosition) {
        event.preventDefault();
        event.stopPropagation();

        const range = doc.createRange();
        range.setStart(domPosition.node, domPosition.offset);
        range.collapse(true);

        formatInsertPointWithContentModel(editor, domPosition, (model, context, insertPoint) => {
            if (insertPoint) {
                if (deleteSelection(model, [], context).deleteResult == 'range') {
                    normalizeContentModel(model);
                }

                const startMarker = createSelectionMarker(insertPoint.marker.format);
                const startParagraph = mutateBlock(insertPoint.paragraph);
                const startIndex = startParagraph.segments.indexOf(insertPoint.marker);

                startParagraph.segments.splice(startIndex, 0, startMarker);

                const newInsertPoint = mergeModel(model, droppedModel, context, {
                    insertPosition: insertPoint,
                });

                if (newInsertPoint) {
                    setSelection(model, startMarker, newInsertPoint.marker);
                }
            }
        });
    }
}
