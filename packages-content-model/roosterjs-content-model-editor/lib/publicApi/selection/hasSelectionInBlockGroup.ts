import hasSelectionInBlock from './hasSelectionInBlock';
import type { ContentModelBlockGroup } from 'roosterjs-content-model-types';

/**
 * Check if there is selection within the given block
 * @param block The block to check
 */
export default function hasSelectionInBlockGroup(group: ContentModelBlockGroup): boolean {
    if (group.blockGroupType == 'TableCell' && group.isSelected) {
        return true;
    }

    if (group.blocks.some(hasSelectionInBlock)) {
        return true;
    }

    return false;
}
