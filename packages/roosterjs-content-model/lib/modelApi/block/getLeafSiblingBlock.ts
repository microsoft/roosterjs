import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { isGeneralSegment } from '../common/isGeneralSegment';

/**
 * @internal
 */
export type BlockAndPath = {
    /**
     * The sibling block
     */
    block: ContentModelBlock;

    /**
     * Path of this sibling block
     */
    path: ContentModelBlockGroup[];

    /**
     * If the input block is under a general segment, it is possible there are sibling segments under the same paragraph.
     * Use this property to return the sibling sibling under the same paragraph
     */
    siblingSegment?: ContentModelSegment;
};

/**
 * @internal
 */
export function getLeafSiblingBlock(
    path: ContentModelBlockGroup[],
    block: ContentModelBlock,
    isNext: boolean
): BlockAndPath | null {
    const newPath = [...path];

    while (newPath.length > 0) {
        let group = newPath[0];
        const index = group.blocks.indexOf(block);

        if (index < 0) {
            break;
        }

        let nextBlock = group.blocks[index + (isNext ? 1 : -1)];

        if (nextBlock) {
            while (nextBlock.blockType == 'BlockGroup') {
                const child = nextBlock.blocks[isNext ? 0 : nextBlock.blocks.length - 1];

                if (!child) {
                    return { block: nextBlock, path: newPath };
                } else if (child.blockType != 'BlockGroup') {
                    newPath.unshift(nextBlock);
                    return { block: child, path: newPath };
                } else {
                    newPath.unshift(nextBlock);
                    nextBlock = child;
                }
            }

            return { block: nextBlock, path: newPath };
        } else if (isGeneralSegment(group)) {
            // For general segment, we need to check if there is sibling segment under the same paragraph
            // First let's find the parent paragraph of this segment
            newPath.shift();

            let segmentIndex = -1;
            const segment = group;
            const para = newPath[0]?.blocks.find(
                x => x.blockType == 'Paragraph' && (segmentIndex = x.segments.indexOf(segment)) >= 0
            ) as ContentModelParagraph;

            if (para) {
                // Now we have found the parent paragraph, so let's check if it has a sibling segment
                const siblingSegment = para.segments[segmentIndex + (isNext ? 1 : -1)];

                if (siblingSegment) {
                    // Return this block, path and segment since we have found it
                    return { block: para, path: newPath, siblingSegment };
                } else {
                    // No sibling segment, let's keep go upper level
                    block = para;
                }
            } else {
                // Parent sibling is not found (in theory this should never happen), just return null
                break;
            }
        } else if (group.blockGroupType != 'Document' && group.blockGroupType != 'TableCell') {
            newPath.shift();
            block = group;
        } else {
            break;
        }
    }

    return null;
}
