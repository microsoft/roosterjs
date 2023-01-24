import { addBlock } from './addBlock';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';

/**
 * @internal
 */
export interface WrapBlockStep1Result<T extends ContentModelBlockGroup & ContentModelBlock> {
    parent: ContentModelBlockGroup;
    wrapper: T;
}

/**
 * @internal
 */
export function wrapBlockStep1<T extends ContentModelBlockGroup & ContentModelBlock>(
    step1Result: WrapBlockStep1Result<T>[],
    parent: ContentModelBlockGroup | null,
    blockToWrap: ContentModelBlock,
    creator: () => T,
    canMerge: (target: ContentModelBlock) => target is T
) {
    const index = parent?.blocks.indexOf(blockToWrap) ?? -1;

    if (parent && index >= 0) {
        parent.blocks.splice(index, 1);

        const prevBlock = parent.blocks[index - 1];
        const wrapper = canMerge(prevBlock) ? prevBlock : createAndAdd(parent, index, creator);

        setParagraphNotImplicit(blockToWrap);
        addBlock(wrapper, blockToWrap);

        // Use reverse order, so that we can merge from last to first to avoid modifying unmerged quotes
        step1Result.unshift({ parent, wrapper });
    }
}

/**
 * @internal
 */
export function wrapBlockStep2<T extends ContentModelBlockGroup & ContentModelBlock>(
    step1Result: WrapBlockStep1Result<T>[],
    canMerge: (target: ContentModelBlock, current: T) => target is T
) {
    step1Result.forEach(({ parent, wrapper }) => {
        const index = parent.blocks.indexOf(wrapper);
        const nextBlock = parent.blocks[index + 1];

        if (index >= 0 && canMerge(nextBlock, wrapper)) {
            wrapper.blocks.forEach(setParagraphNotImplicit);
            arrayPush(wrapper.blocks, nextBlock.blocks);
            parent.blocks.splice(index + 1, 1);
        }
    });
}

function createAndAdd<T extends ContentModelBlockGroup & ContentModelBlock>(
    parent: ContentModelBlockGroup,
    index: number,
    creator: () => T
): T {
    const block = creator();

    parent.blocks.splice(index, 0, block);
    return block;
}
