import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { InsertPosition } from './deleteSelections';
import { iterateSelections } from './iterateSelections';

/**
 * @internal
 */
export function getCollapsedInsertPoint(model: ContentModelDocument): InsertPosition | null {
    let result: InsertPosition | null = null;

    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            const segment = segments?.[0];
            if (
                block?.blockType == 'Paragraph' &&
                segment?.segmentType == 'SelectionMarker' &&
                segments?.length == 1 &&
                !result
            ) {
                result = {
                    marker: segment,
                    paragraph: block,
                    path: path,
                    tableContext: tableContext,
                };
            } else {
                result = null;
                return true;
            }
        },
        {
            ignoreContentUnderSelectedTableCell: true,
        }
    );

    return result;
}
