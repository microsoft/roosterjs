import hasSelectionInBlockGroup from './hasSelectionInBlockGroup';
import hasSelectionInSegment from './hasSelectionInSegment';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';

/**
 * Check if there is selection within the given block
 * @param block The block to check
 */
export default function hasSelectionInBlock(block: ContentModelBlock): boolean {
    switch (block.blockType) {
        case 'Paragraph':
            return block.segments.some(hasSelectionInSegment);

        case 'Table':
            return block.rows.some(row => row.cells.some(hasSelectionInBlockGroup));

        case 'BlockGroup':
            return hasSelectionInBlockGroup(block);

        case 'Divider':
        case 'Entity':
            return !!block.isSelected;

        default:
            return false;
    }
}
