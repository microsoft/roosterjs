import { ContentModelBlockGroup } from '../../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../../publicTypes/block/ContentModelParagraph';
import { ContentModelSelectionMarker } from '../../../publicTypes/segment/ContentModelSelectionMarker';
import { InsertPoint } from '../../../publicTypes/selection/InsertPoint';
import { TableSelectionContext } from '../../../publicTypes/selection/TableSelectionContext';

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
