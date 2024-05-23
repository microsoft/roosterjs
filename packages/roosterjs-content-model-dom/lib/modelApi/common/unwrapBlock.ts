import { mutateBlock } from './mutate';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';
import type {
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
} from 'roosterjs-content-model-types';

/**
 * Unwrap a given block group, move its child blocks to be under its parent group
 * @param parent Parent block group of the unwrapping group
 * @param groupToUnwrap  The block group to unwrap
 */
export function unwrapBlock(
    parent: ReadonlyContentModelBlockGroup | null,
    groupToUnwrap: ReadonlyContentModelBlockGroup & ReadonlyContentModelBlock
) {
    const index = parent?.blocks.indexOf(groupToUnwrap) ?? -1;

    if (index >= 0) {
        groupToUnwrap.blocks.forEach(setParagraphNotImplicit);

        if (parent) {
            mutateBlock(parent)?.blocks.splice(index, 1, ...groupToUnwrap.blocks.map(mutateBlock));
        }
    }
}
