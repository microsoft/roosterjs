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
export function setModelDirection(model: ReadonlyContentModelDocument, direction: 'ltr' | 'rtl' | 'auto') {
    splitSelectedParagraphByBr(model);

    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        let calcDirection: 'ltr' | 'rtl';
        if (direction === 'auto') {
            calcDirection = determineTextDirection(block)
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
    let innerText = block.cachedElement?.innerText;

    if (!!innerText) {
        // Strongly typed RTL character ranges. Referenced unicode's DerivedBidiClass.txt, excluding things in the 2 bit range.
        const rtlPattern = /[\u0590-\u05FF\u0600-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/g;

        // Remove links
        innerText = innerText.replace(
            /http\S+|www\S+|https\S+|<a\s+(?:[^>]*?\s+)?href=(["']).*?\1.*?>.*?<\/a>/g,
            ""
        );

        const rtlMatches = innerText.match(rtlPattern);
        const rtlCount = rtlMatches ? rtlMatches.length : 0;

        const ltrCount = innerText.length - rtlCount;

        return rtlCount > ltrCount ? "rtl" : "ltr";
    } else {
        return 'ltr'; // Default to LTR if no text is found
    };
}


