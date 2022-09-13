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
            return block.cells.some(row => row.some(hasSelectionInBlock));

        case 'BlockGroup':
            if (block.blockGroupType == 'TableCell' && block.isSelected) {
                return true;
            }

            if (block.blocks.some(hasSelectionInBlock)) {
                return true;
            }

            return false;

        default:
            return false;
    }
}
