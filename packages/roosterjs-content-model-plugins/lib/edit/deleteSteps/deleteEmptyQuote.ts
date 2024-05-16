import {
    createParagraph,
    createSelectionMarker,
    unwrapBlock,
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelFormatContainer,
    DeleteSelectionStep,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelFormatContainer,
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
        const rawEvent = formatContext?.rawEvent as KeyboardEvent;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['FormatContainer', 'ListItem'],
            ['TableCell']
        );
        const quote = path[index];

        if (quote && quote.blockGroupType === 'FormatContainer' && quote.tagName == 'blockquote') {
            const parent = path[index + 1];
            const quoteBlockIndex = parent.blocks.indexOf(quote);
            const blockQuote = parent.blocks[quoteBlockIndex];
            if (
                isBlockGroupOfType<ContentModelFormatContainer>(blockQuote, 'FormatContainer') &&
                blockQuote.tagName === 'blockquote'
            ) {
                if (isEmptyQuote(blockQuote)) {
                    unwrapBlock(parent, blockQuote);
                    rawEvent?.preventDefault();
                    context.deleteResult = 'range';
                } else if (isSelectionOnEmptyLine(blockQuote) && rawEvent?.key === 'Enter') {
                    insertNewLine(blockQuote, parent, quoteBlockIndex);
                    rawEvent?.preventDefault();
                    context.deleteResult = 'range';
                }
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

const isSelectionOnEmptyLine = (quote: ContentModelFormatContainer) => {
    const quoteLength = quote.blocks.length;
    const lastParagraph = quote.blocks[quoteLength - 1];
    if (lastParagraph && lastParagraph.blockType === 'Paragraph') {
        return lastParagraph.segments.every(
            s => s.segmentType === 'SelectionMarker' || s.segmentType === 'Br'
        );
    }
};

const insertNewLine = (
    quote: ReadonlyContentModelFormatContainer,
    parent: ReadonlyContentModelBlockGroup,
    index: number
) => {
    const quoteLength = quote.blocks.length;
    mutateBlock(quote).blocks.splice(quoteLength - 1, 1);
    const marker = createSelectionMarker();
    const newParagraph = createParagraph(false /* isImplicit */);
    newParagraph.segments.push(marker);
    mutateBlock(parent).blocks.splice(index + 1, 0, newParagraph);
};
