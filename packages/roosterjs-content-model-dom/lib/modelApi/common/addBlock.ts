import { mutateBlock } from './mutate';
import type {
    ReadonlyContentModelBlockGroup,
    ShallowMutableContentModelBlock,
} from 'roosterjs-content-model-types';

/**
 * Add a given block to block group
 * @param group The block group to add block into
 * @param block The block to add
 */
export function addBlock(
    group: ReadonlyContentModelBlockGroup,
    block: ShallowMutableContentModelBlock
) {
    mutateBlock(group).blocks.push(block);
}
