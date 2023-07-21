import { createListLevel } from './createListLevel';
import { createSelectionMarker } from './createSelectionMarker';
import {
    ContentModelListItem,
    ContentModelListLevel,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelListItem model
 * @param levels Existing list levels
 * @param format @optional The format of this model
 */
export function createListItem(
    levels: ContentModelListLevel[],
    format?: ContentModelSegmentFormat
): ContentModelListItem {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels
            ? levels.map(level => createListLevel(level.listType, level.format, level.dataset))
            : [],
        formatHolder: createSelectionMarker(format),
        format: {},
    };
}
