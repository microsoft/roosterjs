import type {
    EntityRemovalOperation,
    FormatContentModelContext,
    ReadonlyContentModelBlock,
} from 'roosterjs-content-model-types';

/**
 * Delete a content model block from current selection
 * @param blocks Array of the block to delete
 * @param blockToDelete The block to delete
 * @param replacement @optional If specified, use this block to replace the deleted block
 * @param context @optional Context object provided by formatContentModel API
 * @param direction @optional Whether this is deleting forward or backward. This is only used for deleting entity.
 * If not specified, only selected entity will be deleted
 */
export function deleteBlock(
    blocks: ReadonlyContentModelBlock[],
    blockToDelete: ReadonlyContentModelBlock,
    replacement?: ReadonlyContentModelBlock,
    context?: FormatContentModelContext,
    direction?: 'forward' | 'backward'
): boolean {
    const index = blocks.indexOf(blockToDelete);

    switch (blockToDelete.blockType) {
        case 'Table':
        case 'Divider':
            replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            return true;

        case 'Entity':
            const operation: EntityRemovalOperation | undefined = blockToDelete.isSelected
                ? 'overwrite'
                : direction == 'forward'
                ? 'removeFromStart'
                : direction == 'backward'
                ? 'removeFromEnd'
                : undefined;

            if (operation !== undefined) {
                replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
                context?.deletedEntities.push({
                    entity: blockToDelete,
                    operation,
                });
            }

            return true;

        case 'BlockGroup':
            switch (blockToDelete.blockGroupType) {
                case 'General':
                    if (replacement) {
                        blocks.splice(index, 1, replacement);
                        return true;
                    } else {
                        // no op, let browser handle it
                        return false;
                    }

                case 'ListItem':
                case 'FormatContainer':
                    blocks.splice(index, 1);
                    return true;
            }
    }

    return false;
}
