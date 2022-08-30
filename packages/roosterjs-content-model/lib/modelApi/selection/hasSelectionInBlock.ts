import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { hasSelectionInSegment } from './hasSelectionInSegment';

/**
 * @internal
 */
export function hasSelectionInBlock(block: ContentModelBlock): boolean {
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
