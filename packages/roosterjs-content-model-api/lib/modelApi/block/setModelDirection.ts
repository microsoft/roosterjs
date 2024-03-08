import { applyTableFormat } from 'roosterjs-content-model-core';
import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import {
    getOperationalBlocks,
    isBlockGroupOfType,
    updateTableCellMetadata,
} from 'roosterjs-content-model-dom';
import type {
    BorderFormat,
    ContentModelBlock,
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
            internalSetDirection(block.format, direction, block);
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}

function internalSetDirection(
    format: ContentModelBlockFormat,
    direction: 'ltr' | 'rtl',
    block?: ContentModelBlock
) {
    const wasRtl = format.direction == 'rtl';
    const isRtl = direction == 'rtl';

    if (wasRtl != isRtl) {
        format.direction = direction;

        // Adjust margin when change direction
        const marginLeft = format.marginLeft;
        const paddingLeft = format.paddingLeft;

        setProperty(format, 'marginLeft', format.marginRight);
        setProperty(format, 'marginRight', marginLeft);
        setProperty(format, 'paddingLeft', format.paddingRight);
        setProperty(format, 'paddingRight', paddingLeft);

        // If whole Table direction changed, flip cell side borders
        if (block && block.blockType == 'Table') {
            block.rows.forEach(row => {
                row.cells.forEach(cell => {
                    // Optimise by skipping cells with unchanged borders
                    updateTableCellMetadata(cell, metadata => {
                        if (metadata?.borderOverride) {
                            const storeBorderLeft = cell.format.borderLeft;
                            setProperty(cell.format, 'borderLeft', cell.format.borderRight);
                            setProperty(cell.format, 'borderRight', storeBorderLeft);
                        }
                        return metadata;
                    });
                });
            });

            // Apply changed borders
            applyTableFormat(block, undefined /* newFormat */, true /* keepCellShade*/);
        }
    }
}

function setProperty(
    format: MarginFormat & PaddingFormat & BorderFormat,
    key: keyof (MarginFormat & PaddingFormat & BorderFormat),
    value: string | undefined
) {
    if (value) {
        format[key] = value;
    } else {
        delete format[key];
    }
}
