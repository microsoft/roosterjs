import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';
import {
    ContentModelBlockGroup,
    ContentModelParagraph,
    ContentModelSelectionMarker,
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
