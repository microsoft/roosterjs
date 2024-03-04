import type { ContentModelBlock, ContentModelBlockGroup } from 'roosterjs-content-model-types';

/**
 * Add a given block to block group
 * @param group The block group to add block into
 * @param block The block to add
 */
export function addBlock(group: ContentModelBlockGroup, block: ContentModelBlock) {
    group.blocks.push(block);
}
