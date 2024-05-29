import { createListLevel } from './createListLevel';
import { createSelectionMarker } from './createSelectionMarker';
import type {
    ContentModelListItem,
    ContentModelSegmentFormat,
    ReadonlyContentModelListLevel,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelListItem model
 * @param levels Existing list levels
 * @param format @optional The format of this model
 */
export function createListItem(
    levels: ReadonlyArray<ReadonlyContentModelListLevel>,
    format?: Readonly<ContentModelSegmentFormat>
): ContentModelListItem {
    const formatHolder = createSelectionMarker(format);

    formatHolder.isSelected = false;

    return {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels
            ? levels.map(level => createListLevel(level.listType, level.format, level.dataset))
            : [],
        formatHolder,
        format: {},
    };
}
