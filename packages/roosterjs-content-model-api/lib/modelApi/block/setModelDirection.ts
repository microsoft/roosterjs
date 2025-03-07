import { findListItemsInSameThread } from '../list/findListItemsInSameThread';
import { splitSelectedParagraphByBr } from './splitSelectedParagraphByBr';
import {
    applyTableFormat,
    getOperationalBlocks,
    isBlockGroupOfType,
    mutateBlock,
    updateTableCellMetadata,
} from 'roosterjs-content-model-dom';
import type {
    BorderFormat,
    ContentModelListItem,
    MarginFormat,
    PaddingFormat,
    ReadonlyContentModelBlock,
    ReadonlyContentModelDocument,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setModelDirection(model: ReadonlyContentModelDocument, direction: 'ltr' | 'rtl') {
    splitSelectedParagraphByBr(model);

    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const items = findListItemsInSameThread(model, block);

            items.forEach(readonlyItem => {
                const item = mutateBlock(readonlyItem);

                item.levels.forEach(level => {
                    level.format.direction = direction;
                });

                item.blocks.forEach(block => internalSetDirection(block, direction));
            });
        } else if (block) {
            internalSetDirection(block, direction);
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}

function internalSetDirection(block: ReadonlyContentModelBlock, direction: 'ltr' | 'rtl') {
    const wasRtl = block.format.direction == 'rtl';
    const isRtl = direction == 'rtl';

    if (wasRtl != isRtl) {
        const { format } = mutateBlock(block);
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
                    updateTableCellMetadata(mutateBlock(cell), metadata => {
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
