import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-dom';
import type {
    ContentModelBlockGroup,
    InsertPoint,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function getListItemFromInsertPoint(
    insertPoint: InsertPoint
): [ReadonlyContentModelListItem, ReadonlyContentModelBlockGroup] | null {
    const { paragraph, marker, path } = insertPoint;
    const index = getClosestAncestorBlockGroupIndex<ContentModelBlockGroup>(
        path,
        ['ListItem'],
        ['TableCell', 'FormatContainer']
    );
    const item = path[index];
    const parent = path[index + 1];

    return item?.blockGroupType == 'ListItem' &&
        item.levels.length > 0 &&
        paragraph.segments[0] == marker &&
        parent
        ? [item, parent]
        : null;
}
