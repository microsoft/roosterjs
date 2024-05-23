import type {
    ShallowMutableContentModelBlock,
    ShallowMutableContentModelBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Add a given block to block group
 * @param group The block group to add block into
 * @param block The block to add
 */
export function addBlock(
    group: ShallowMutableContentModelBlockGroup,
    block: ShallowMutableContentModelBlock
) {
    group.blocks.push(block);
}
