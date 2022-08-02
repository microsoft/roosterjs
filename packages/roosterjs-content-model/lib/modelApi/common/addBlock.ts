import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';

/**
 * @internal
 */
export function addBlock(group: ContentModelBlockGroup, block: ContentModelBlock) {
    group.blocks.push(block);
}
