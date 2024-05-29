import {
    unwrapBlock,
    getClosestAncestorBlockGroupIndex,
    isBlockGroupOfType,
    createFormatContainer,
    mutateBlock,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelFormatContainer,
    DeleteSelectionStep,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelParagraph,
    ShallowMutableContentModelFormatContainer,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteEmptyQuote: DeleteSelectionStep = context => {
    const { deleteResult } = context;

    if (deleteResult == 'nothingToDelete' || deleteResult == 'notDeleted') {
        const { insertPoint, formatContext } = context;
        const { path, paragraph } = insertPoint;
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
                } else if (
                    isSelectionOnEmptyLine(blockQuote, paragraph) &&
                    rawEvent?.key === 'Enter'
                ) {
                    insertNewLine(blockQuote, parent, quoteBlockIndex, paragraph);
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

const isSelectionOnEmptyLine = (
    quote: ReadonlyContentModelFormatContainer,
    paragraph: ReadonlyContentModelParagraph
) => {
    const paraIndex = quote.blocks.indexOf(paragraph);

    if (paraIndex >= 0) {
        return paragraph.segments.every(
            s => s.segmentType === 'SelectionMarker' || s.segmentType === 'Br'
        );
    } else {
        return false;
    }
};

const insertNewLine = (
    quote: ShallowMutableContentModelFormatContainer,
    parent: ReadonlyContentModelBlockGroup,
    quoteIndex: number,
    paragraph: ShallowMutableContentModelParagraph
) => {
    const paraIndex = quote.blocks.indexOf(paragraph);

    if (paraIndex >= 0) {
        const mutableParent = mutateBlock(parent);

        if (paraIndex < quote.blocks.length - 1) {
            const newQuote: ShallowMutableContentModelFormatContainer = createFormatContainer(
                quote.tagName,
                quote.format
            );

            newQuote.blocks.push(
                ...quote.blocks.splice(paraIndex + 1, quote.blocks.length - paraIndex - 1)
            );

            mutableParent.blocks.splice(quoteIndex + 1, 0, newQuote);
        }

        mutableParent.blocks.splice(quoteIndex + 1, 0, paragraph);
        quote.blocks.splice(paraIndex, 1);

        if (quote.blocks.length == 0) {
            mutableParent.blocks.splice(quoteIndex, 0);
        }
    }
};
