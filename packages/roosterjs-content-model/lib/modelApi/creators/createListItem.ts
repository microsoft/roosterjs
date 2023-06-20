import { createSelectionMarker } from './createSelectionMarker';
import {
    ContentModelListItem,
    ContentModelListItemLevelFormat,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

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
