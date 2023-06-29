import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import {
    ContentModelBlock,
    ContentModelDocument,
    ContentModelListItem,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setModelDirection(model: ContentModelDocument, direction: 'ltr' | 'rtl') {
    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const items = findListItemsInSameThread(model, block);

            items.forEach(item => {
                item.levels.forEach(level => {
                    level.direction = direction;
                });
            });

            block.blocks.forEach(block => internalSetDirection(block, direction));
        } else if (block) {
            internalSetDirection(block, direction);
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}

function internalSetDirection(block: ContentModelBlock, direction: 'ltr' | 'rtl') {
    block.format.direction = direction;

    // Adjust margin when change direction
    // TODO: make margin and padding direction-aware, like what we did for textAlign. So no need to adjust them here
    // TODO: Do we also need to handle border here?
    const marginLeft = block.format.marginLeft;
    const paddingLeft = block.format.paddingLeft;

    block.format.marginLeft = block.format.marginRight;
    block.format.marginRight = marginLeft;

    block.format.paddingLeft = block.format.paddingRight;
    block.format.paddingRight = paddingLeft;
}
