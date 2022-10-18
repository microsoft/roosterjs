import { addBlock } from '../../modelApi/common/addBlock';
import { createQuote } from '../../modelApi/creators/createQuote';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys, getStyles } from 'roosterjs-editor-dom';

const KnownQuoteStyleNames = ['margin-top', 'margin-bottom'];

/**
 * @internal
 */
export const quoteProcessor: ElementProcessor<HTMLQuoteElement> = (group, element, context) => {
    const styles = getStyles(element);

    if (
        parseInt(element.style.marginTop) === 0 &&
        parseInt(element.style.marginBottom) === 0 &&
        getObjectKeys(styles).every(key => KnownQuoteStyleNames.indexOf(key) >= 0)
    ) {
        // Temporary solution: Use Quote to provide indentation
        // TODO: We should use CSS to do indentation, and only use Quote for quoted text
        const quote = createQuote();

        addBlock(group, quote);
        context.elementProcessors.child(quote, element, context);
    } else {
        context.elementProcessors['*'](group, element, context);
    }
};
