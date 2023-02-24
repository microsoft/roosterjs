import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelListItemFormat } from '../../publicTypes/format/ContentModelListItemFormat';
import { ContentModelListItemLevelFormat } from '../../publicTypes/format/ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createSelectionMarker } from './createSelectionMarker';

/**
 * @internal
 */
export function createListItem(
    levels: ContentModelListItemLevelFormat[],
    format?: ContentModelSegmentFormat,
    listItemFormat?: ContentModelListItemFormat
): ContentModelListItem {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels ? levels.map(level => ({ ...level })) : [],
        formatHolder: createSelectionMarker(format),
        format: {},
        listItemFormat: {
            segmentType: 'Li',
            isSelected: true,
            format: format ? { ...format } : {},
        },
    };
}
