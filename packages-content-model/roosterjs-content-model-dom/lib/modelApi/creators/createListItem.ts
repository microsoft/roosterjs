import { createListLevel } from './createListLevel';
import { createSelectionMarker } from './createSelectionMarker';
import type {
    ContentModelListItem,
    ContentModelListItemFormat,
    ContentModelListLevel,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelListItem model
 * @param levels Existing list levels
 * @param formatHolderFormat @optional The segment format of this list model
 * @param listFormat @optional The block format of this list model
 */
export function createListItem(
    levels: ContentModelListLevel[],
    formatHolderFormat?: ContentModelSegmentFormat,
    listFormat?: ContentModelListItemFormat
): ContentModelListItem {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels
            ? levels.map(level => createListLevel(level.listType, level.format, level.dataset))
            : [],
        formatHolder: createSelectionMarker(formatHolderFormat),
        format: { ...listFormat },
    };
}
