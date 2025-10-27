import { iterateSelections } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegment,
    ReadonlyTableSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function adjustSelectionForCopyCut(pasteModel: ContentModelDocument) {
    let selectionMarker: ContentModelSegment | undefined;
    let firstBlock: ContentModelParagraph | undefined;
    let tableContext: ReadonlyTableSelectionContext | undefined;

    iterateSelections(pasteModel, (_, tableCtxt, block, segments) => {
        if (selectionMarker) {
            if (tableCtxt != tableContext && firstBlock?.segments.includes(selectionMarker)) {
                firstBlock.segments.splice(firstBlock.segments.indexOf(selectionMarker), 1);
            }
            return true;
        }

        const marker = segments?.find(segment => segment.segmentType == 'SelectionMarker');
        if (!selectionMarker && marker) {
            tableContext = tableCtxt;
            firstBlock = block?.blockType == 'Paragraph' ? block : undefined;
            selectionMarker = marker;
        }

        return false;
    });
}
