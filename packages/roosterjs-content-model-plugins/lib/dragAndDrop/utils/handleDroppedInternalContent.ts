import { formatInsertPointWithContentModel } from 'roosterjs-content-model-api';
import {
    cloneModelForPaste,
    createSelectionMarker,
    deleteSelection,
    getNodePositionFromEvent,
    mergeModel,
    mutateBlock,
    normalizeContentModel,
    setSelection,
    trimModelForSelection,
} from 'roosterjs-content-model-dom';
import type { IEditor } from 'roosterjs-content-model-types';
import { reorderList } from './reorderList';

/**
 * @internal
 * Handle dropped internal HTML content by inserting it at the drop position
 */
export function handleDroppedInternalContent(editor: IEditor, event: DragEvent): void {
    const doc = editor.getDocument();
    const domPosition = getNodePositionFromEvent(doc, editor.getDOMHelper(), event.x, event.y);
    const selection = editor.getDOMSelection();
    if (domPosition && selection) {
        event.preventDefault();
        event.stopPropagation();

        formatInsertPointWithContentModel(editor, domPosition, (model, context, insertPoint) => {
            if (insertPoint) {
                const cloneModel = cloneModelForPaste(model);
                trimModelForSelection(cloneModel, selection);

                if (!event.ctrlKey && !event.metaKey) {
                    if (deleteSelection(model, [reorderList], context).deleteResult == 'range') {
                        normalizeContentModel(model);
                    }
                }

                const startMarker = createSelectionMarker(insertPoint.marker.format);
                const startParagraph = mutateBlock(insertPoint.paragraph);
                const startIndex = startParagraph.segments.indexOf(insertPoint.marker);

                startParagraph.segments.splice(startIndex, 0, startMarker);

                const newInsertPoint = mergeModel(model, cloneModel, context, {
                    insertPosition: insertPoint,
                    mergeParagraphAfterList: true,
                });

                if (newInsertPoint) {
                    setSelection(model, startMarker, newInsertPoint.marker);
                }
            }
        });
    }
}
