import { ContentModelBlock } from 'roosterjs-content-model-types';
import { EntityOperation } from 'roosterjs-editor-types';
import { FormatWithContentModelContext } from '../../../publicApi/utils/formatWithContentModel';

/**
 * @internal
 */
export function deleteBlock(
    blocks: ContentModelBlock[],
    blockToDelete: ContentModelBlock,
    replacement?: ContentModelBlock,
    context?: FormatWithContentModelContext,
    direction?: 'forward' | 'backward'
): boolean {
    const index = blocks.indexOf(blockToDelete);

    switch (blockToDelete.blockType) {
        case 'Table':
        case 'Divider':
            replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
            return true;

        case 'Entity':
            const operation = blockToDelete.isSelected
                ? EntityOperation.Overwrite
                : direction == 'forward'
                ? EntityOperation.RemoveFromStart
                : direction == 'backward'
                ? EntityOperation.RemoveFromEnd
                : undefined;

            if (operation !== undefined) {
                replacement ? blocks.splice(index, 1, replacement) : blocks.splice(index, 1);
                context?.deleteEntities.push({
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
