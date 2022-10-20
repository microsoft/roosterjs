import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelQuote } from '../../publicTypes/block/group/ContentModelQuote';
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

        context.modelHandlers.blockGroupChildren(doc, blockQuote, quote, context);
    }
};
