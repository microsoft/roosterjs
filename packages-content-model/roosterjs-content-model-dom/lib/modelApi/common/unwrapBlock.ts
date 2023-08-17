import { ContentModelBlock, ContentModelBlockGroup } from 'roosterjs-content-model-types';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';

/**
 * Unwrap a given block group, move its child blocks to be under its parent group
 * @param parent Parent block group of the unwrapping group
 * @param groupToUnwrap  The block group to unwrap
 */
export function unwrapBlock(
    parent: ContentModelBlockGroup | null,
    groupToUnwrap: ContentModelBlockGroup & ContentModelBlock
) {
    const index = parent?.blocks.indexOf(groupToUnwrap) ?? -1;

    if (index >= 0) {
        groupToUnwrap.blocks.forEach(setParagraphNotImplicit);

        parent?.blocks.splice(index, 1, ...groupToUnwrap.blocks);
    }
}
