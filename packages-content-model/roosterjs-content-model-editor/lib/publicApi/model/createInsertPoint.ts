import type { InsertPoint, TableSelectionContext } from 'roosterjs-content-model-editor';
import type {
    ContentModelBlockGroup,
    ContentModelParagraph,
    ContentModelSelectionMarker,
} from 'roosterjs-content-model-types';

/**
 * Create an Insert Point object
 * @param marker The selection marker of this insert point
 * @param paragraph Paragraph of this insert point
 * @param path Block group path of this insert point
 * @param tableContext Table context of this insert point
 */
export function createInsertPoint(
    marker: ContentModelSelectionMarker,
    paragraph: ContentModelParagraph,
    path: ContentModelBlockGroup[],
    tableContext: TableSelectionContext | undefined
): InsertPoint {
    return {
        marker,
        paragraph,
        path,
        tableContext,
    };
}
