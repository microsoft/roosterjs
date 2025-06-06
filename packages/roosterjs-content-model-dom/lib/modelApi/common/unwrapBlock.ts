import { copyFormat } from '../../modelApi/block/copyFormat';
import { mutateBlock } from './mutate';
import { setParagraphNotImplicit } from '../block/setParagraphNotImplicit';
import type {
    ContentModelBlockFormat,
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
    groupToUnwrap: ReadonlyContentModelBlockGroup & ReadonlyContentModelBlock,
    formatsToKeep?: (keyof ContentModelBlockFormat)[]
) {
    const index = parent?.blocks.indexOf(groupToUnwrap) ?? -1;

    if (index >= 0) {
        groupToUnwrap.blocks.forEach(setParagraphNotImplicit);

        if (parent) {
            mutateBlock(parent)?.blocks.splice(
                index,
                1,
                ...groupToUnwrap.blocks.map(x => {
                    const mutableBlock = mutateBlock(x);

                    if (formatsToKeep) {
                        copyFormat<ContentModelBlockFormat>(
                            mutableBlock.format,
                            groupToUnwrap.format,
                            formatsToKeep
                        );
                    }

                    return mutableBlock;
                })
            );
        }
    }
}
