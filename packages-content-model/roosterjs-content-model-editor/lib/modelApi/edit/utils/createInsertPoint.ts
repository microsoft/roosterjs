import type {
    ContentModelBlockGroup,
    ContentModelParagraph,
    ContentModelSelectionMarker,
    InsertPoint,
    TableSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
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
