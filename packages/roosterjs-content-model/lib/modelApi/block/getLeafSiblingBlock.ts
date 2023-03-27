import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';

/**
 * @internal
 */
export type BlockAndPath = {
    block: ContentModelBlock;
    path: ContentModelBlockGroup[];
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
        } else if (group.blockGroupType != 'Document' && group.blockGroupType != 'TableCell') {
            newPath.shift();
            block = group;
        } else {
            break;
        }
    }

    return null;
}
