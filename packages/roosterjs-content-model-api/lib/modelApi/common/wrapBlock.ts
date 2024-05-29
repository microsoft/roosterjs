import { addBlock, mutateBlock, setParagraphNotImplicit } from 'roosterjs-content-model-dom';
import type {
    ContentModelBlock,
    ContentModelBlockGroup,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ShallowMutableContentModelBlock,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface WrapBlockStep1Result<T extends ContentModelBlockGroup & ContentModelBlock> {
    parent: ReadonlyContentModelBlockGroup;
    wrapper: T;
}

/**
 * @internal
 */
export function wrapBlockStep1<T extends ContentModelBlockGroup & ContentModelBlock>(
    step1Result: WrapBlockStep1Result<T>[],
    readonlyParent: ReadonlyContentModelBlockGroup | null,
    readonlyBlockToWrap: ReadonlyContentModelBlock,
    creator: (isRtl: boolean) => T,
    canMerge: (isRtl: boolean, target: ShallowMutableContentModelBlock) => target is T
) {
    const parent = readonlyParent ? mutateBlock(readonlyParent) : null;
    const blockToWrap = mutateBlock(readonlyBlockToWrap);
    const index = parent?.blocks.indexOf(blockToWrap) ?? -1;

    if (parent && index >= 0) {
        parent.blocks.splice(index, 1);

        const readonlyPrevBlock: ReadonlyContentModelBlock = parent.blocks[index - 1];
        const prevBlock = readonlyPrevBlock ? mutateBlock(readonlyPrevBlock) : null;
        const isRtl = blockToWrap.format.direction == 'rtl';
        const wrapper =
            prevBlock && canMerge(isRtl, prevBlock)
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
    canMerge: (isRtl: boolean, target: ShallowMutableContentModelBlock, current: T) => target is T
) {
    step1Result.forEach(({ parent, wrapper }) => {
        const index = parent.blocks.indexOf(wrapper);
        const readonlyNextBlock = parent.blocks[index + 1];
        const nextBlock = readonlyNextBlock ? mutateBlock(readonlyNextBlock) : null;
        const isRtl = wrapper.format.direction == 'rtl';

        if (index >= 0 && nextBlock && canMerge(isRtl, nextBlock, wrapper)) {
            wrapper.blocks.forEach(setParagraphNotImplicit);
            wrapper.blocks.push(...nextBlock.blocks);
            mutateBlock(parent).blocks.splice(index + 1, 1);
        }
    });
}

function createAndAdd<T extends ContentModelBlockGroup & ContentModelBlock>(
    parent: ReadonlyContentModelBlockGroup,
    index: number,
    creator: (isRtl: boolean) => T,
    isRtl: boolean
): T {
    const block = creator(isRtl);

    mutateBlock(parent).blocks.splice(index, 0, block);

    return block;
}
