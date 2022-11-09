import { ContentModelHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelQuote } from '../../publicTypes/block/group/ContentModelQuote';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

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
        const blockQuote = doc.createElement('blockquote');
        blockQuote.style.marginTop = '0';
        blockQuote.style.marginBottom = '0';
        parent.appendChild(blockQuote);

        context.modelHandlers.blockGroupChildren(doc, blockQuote, quote, context);
    }
};
