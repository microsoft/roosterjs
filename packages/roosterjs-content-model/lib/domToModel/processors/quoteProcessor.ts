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

                parseFormat(element, context.formatParsers.block, quoteFormat, context);
                parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);

        addBlock(group, quote);
        context.elementProcessors.child(quote, element, context);
    } else {
        context.elementProcessors['*'](group, element, context);
    }
};
