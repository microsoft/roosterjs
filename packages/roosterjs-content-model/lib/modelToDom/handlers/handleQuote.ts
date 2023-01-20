import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelQuote } from '../../publicTypes/group/ContentModelQuote';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { stackFormat } from '../utils/stackFormat';

const QuoteTagName = 'blockquote';

/**
 * @internal
 */
export const handleQuote: ContentModelHandler<ContentModelQuote> = (
    doc: Document,
    parent: Node,
    quote: ContentModelQuote,
    context: ModelToDomContext
) => {
    if (!isBlockGroupEmpty(quote)) {
        const blockQuote = doc.createElement(QuoteTagName);
        parent.appendChild(blockQuote);

        stackFormat(context, QuoteTagName, () => {
            applyFormat(blockQuote, context.formatAppliers.block, quote.format, context);
            applyFormat(
                blockQuote,
                context.formatAppliers.segmentOnBlock,
                quote.quoteSegmentFormat,
                context
            );
        });

        context.modelHandlers.blockGroupChildren(doc, blockQuote, quote, context);
    }
};
