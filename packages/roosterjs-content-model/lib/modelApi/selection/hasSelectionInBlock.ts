import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { hasSelectionInSegment } from './hasSelectionInSegment';

/**
 * @internal
 */
export function hasSelectionInBlock(block: ContentModelBlock): boolean {
    switch (block.blockType) {
        case ContentModelBlockType.Paragraph:
            return block.segments.some(hasSelectionInSegment);

        case ContentModelBlockType.Table:
            return block.cells.some(row => row.some(hasSelectionInBlock));

        case ContentModelBlockType.BlockGroup:
            if (block.blockGroupType == ContentModelBlockGroupType.TableCell && block.isSelected) {
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
