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

const FIRST_STRONG_CHAR_REGEX = new RegExp('[\\p{L}\\u200E\\u200F]', 'u');
const RTL_CHAR_REGEX = new RegExp(
    '[\\u0590-\\u08FF\\u200F\\uFB1D-\\uFDFF\\uFE70-\\uFEFF\\u{10800}-\\u{10FFF}\\u{1E800}-\\u{1E95F}]',
    'u'
);

/**
 * @internal
 */
export function setModelDirection(
    model: ReadonlyContentModelDocument,
    direction: 'ltr' | 'rtl' | 'auto'
) {
    splitSelectedParagraphByBr(model);

    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        let calcDirection: 'ltr' | 'rtl';
        if (direction === 'auto') {
            calcDirection = determineTextDirection(block);
        } else {
            calcDirection = direction;
        }
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            const items = findListItemsInSameThread(model, block);

            items.forEach(readonlyItem => {
                const item = mutateBlock(readonlyItem);

                item.levels.forEach(level => {
                    level.format.direction = calcDirection;
                });

                // We already set direction on levels, no need to keep it on list item level
                delete item.format.direction;

                // Remove textAlign to let it be calculated based on direction change
                delete item.format.textAlign;

                item.blocks.forEach(block => internalSetDirection(block, calcDirection));
            });
        } else if (block) {
            internalSetDirection(block, calcDirection);
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

// Designed to match browser's 'auto' detection, by scanning over the inner text until it hits a strong LTR/RTL character
function determineTextDirection(block: ReadonlyContentModelBlock): 'ltr' | 'rtl' {
    const firstStrongChar = getTextContent(block).match(FIRST_STRONG_CHAR_REGEX)?.[0];

    return firstStrongChar && RTL_CHAR_REGEX.test(firstStrongChar) ? 'rtl' : 'ltr';
}

function getTextContent(block: ReadonlyContentModelBlock): string {
    if (block.blockType === 'Paragraph') {
        return block.segments.reduce(
            (text, segment) => text + (segment.segmentType === 'Text' ? segment.text : ''),
            ''
        );
    } else if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
        return block.blocks.reduce((text, childBlock) => text + getTextContent(childBlock), '');
    } else {
        return '';
    }
}
