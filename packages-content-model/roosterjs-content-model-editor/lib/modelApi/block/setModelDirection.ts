import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import {
    ContentModelBlockFormat,
    ContentModelDocument,
    ContentModelListItem,
    MarginFormat,
    PaddingFormat,
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
                    level.format.direction = direction;
                });

                item.blocks.forEach(block => internalSetDirection(block.format, direction));
            });
        } else if (block) {
            internalSetDirection(block.format, direction);
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}

function internalSetDirection(format: ContentModelBlockFormat, direction: 'ltr' | 'rtl') {
    const wasRtl = format.direction == 'rtl';
    const isRtl = direction == 'rtl';

    if (wasRtl != isRtl) {
        format.direction = direction;

        // Adjust margin when change direction
        // TODO: make margin and padding direction-aware, like what we did for textAlign. So no need to adjust them here
        // TODO: Do we also need to handle border here?
        const marginLeft = format.marginLeft;
        const paddingLeft = format.paddingLeft;

        setProperty(format, 'marginLeft', format.marginRight);
        setProperty(format, 'marginRight', marginLeft);
        setProperty(format, 'paddingLeft', format.paddingRight);
        setProperty(format, 'paddingRight', paddingLeft);
    }
}

function setProperty(
    format: MarginFormat & PaddingFormat,
    key: keyof (MarginFormat & PaddingFormat),
    value: string | undefined
) {
    if (value) {
        format[key] = value;
    } else {
        delete format[key];
    }
}
