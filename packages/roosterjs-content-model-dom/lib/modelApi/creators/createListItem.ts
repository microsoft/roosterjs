import { createListLevel } from './createListLevel';
import { createSelectionMarker } from './createSelectionMarker';
import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelListItem,
    ReadonlyContentModelListItem,
    ReadonlyContentModelListLevel,
    ReadonlyContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelListItem model
 * @param levels Existing list levels
 * @param format @optional The format of this model
 */
export function createListItem(
    levels: ReadonlyContentModelListLevel[],
    format?: ReadonlyContentModelSegmentFormat
): ContentModelListItem {
    const formatHolder = createSelectionMarker(format, true /*isShadowMarker*/);
    const result: ReadonlyContentModelListItem = {
        blockType: 'BlockGroup',
        blockGroupType: 'ListItem',
        blocks: [],
        levels: levels
            ? levels.map(level => createListLevel(level.listType, level.format, level.dataset))
            : [],
        formatHolder,
        format: {},
    };

    return internalConvertToMutableType(result);
}
