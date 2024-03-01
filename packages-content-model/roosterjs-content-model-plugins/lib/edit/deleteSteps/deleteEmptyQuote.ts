import { unwrapBlock } from 'roosterjs-content-model-dom';
import {
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
} from 'roosterjs-content-model-core';
import type {
    ContentModelFormatContainer,
    DeleteSelectionStep,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteEmptyQuote: DeleteSelectionStep = context => {
    const { deleteResult } = context;
    if (
        deleteResult == 'nothingToDelete' ||
        deleteResult == 'notDeleted' ||
        deleteResult == 'range'
    ) {
        const { insertPoint, formatContext } = context;
        const { path } = insertPoint;
        const rawEvent = formatContext?.rawEvent;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['FormatContainer', 'ListItem'],
            ['TableCell']
        );
        const quote = path[index];

        if (
            quote &&
            quote.blockGroupType === 'FormatContainer' &&
            quote.tagName == 'blockquote' &&
            isEmptyQuote(quote)
        ) {
            const parent = path[index + 1];
            const quoteBlockIndex = parent.blocks.indexOf(quote);
            const blockQuote = parent.blocks[quoteBlockIndex];
            if (
                isBlockGroupOfType<ContentModelFormatContainer>(blockQuote, 'FormatContainer') &&
                blockQuote.tagName === 'blockquote'
            ) {
                unwrapBlock(parent, blockQuote);
                rawEvent?.preventDefault();
                context.deleteResult = 'range';
            }
        }
    }
};

const isEmptyQuote = (quote: ContentModelFormatContainer) => {
    return (
        quote.blocks.length === 1 &&
        quote.blocks[0].blockType === 'Paragraph' &&
        quote.blocks[0].segments.every(
            s => s.segmentType === 'SelectionMarker' || s.segmentType === 'Br'
        )
    );
};
