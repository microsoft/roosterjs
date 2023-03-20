import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createSelectionMarker } from './createSelectionMarker';

/**
 * @internal
 */
export function createListItem(
    levels: ContentModelListItemLevelFormat[],
    format?: ContentModelSegmentFormat
): ContentModelListItem {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels ? levels.map(level => ({ ...level })) : [],
        formatHolder: createSelectionMarker(format),
        format: {},
    };
}
