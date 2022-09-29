import { ContentModelQuote } from '../../publicTypes/block/group/ContentModelQuote';
import { handleBlockGroupChildren } from './handleBlockGroupChildren';
import { isBlockGroupEmpty } from '../../modelApi/common/isEmpty';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';

/**
 * @internal
 */
export function handleQuote(
    doc: Document,
    parent: Node,
    quote: ContentModelQuote,
    context: ModelToDomContext
) {
    if (!isBlockGroupEmpty(quote)) {
        const blockQuote = doc.createElement('blockquote');
        blockQuote.style.marginTop = '0';
        blockQuote.style.marginBottom = '0';
        parent.appendChild(blockQuote);

        handleBlockGroupChildren(doc, blockQuote, quote, context);
    }
}
