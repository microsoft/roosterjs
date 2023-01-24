import hasSelectionInBlock from './hasSelectionInBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';

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
