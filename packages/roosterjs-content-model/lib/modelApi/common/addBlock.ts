import type { ContentModelBlock, ContentModelBlockGroup } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function addBlock(group: ContentModelBlockGroup, block: ContentModelBlock) {
    group.blocks.push(block);
}
