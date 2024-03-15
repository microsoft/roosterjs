import { addBlock, setParagraphNotImplicit } from 'roosterjs-content-model-dom';
import type { ContentModelBlock, ContentModelBlockGroup } from 'roosterjs-content-model-types';

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
    creator: (isRtl: boolean) => T,
    canMerge: (isRtl: boolean, target: ContentModelBlock) => target is T
) {
    const index = parent?.blocks.indexOf(blockToWrap) ?? -1;

    if (parent && index >= 0) {
        parent.blocks.splice(index, 1);

        const prevBlock: ContentModelBlock = parent.blocks[index - 1];
        const isRtl = blockToWrap.format.direction == 'rtl';
        const wrapper = canMerge(isRtl, prevBlock)
            ? prevBlock
            : createAndAdd(parent, index, creator, isRtl);

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
    canMerge: (isRtl: boolean, target: ContentModelBlock, current: T) => target is T
) {
    step1Result.forEach(({ parent, wrapper }) => {
        const index = parent.blocks.indexOf(wrapper);
        const nextBlock = parent.blocks[index + 1];
        const isRtl = wrapper.format.direction == 'rtl';

        if (index >= 0 && canMerge(isRtl, nextBlock, wrapper)) {
            wrapper.blocks.forEach(setParagraphNotImplicit);
            wrapper.blocks.push(...nextBlock.blocks);
            parent.blocks.splice(index + 1, 1);
        }
    });
}

function createAndAdd<T extends ContentModelBlockGroup & ContentModelBlock>(
    parent: ContentModelBlockGroup,
    index: number,
    creator: (isRtl: boolean) => T,
    isRtl: boolean
): T {
    const block = creator(isRtl);

    parent.blocks.splice(index, 0, block);
    return block;
}
