import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createQuote } from '../../modelApi/creators/createQuote';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys, getStyles } from 'roosterjs-editor-dom';

const KnownQuoteStyleNames = ['margin-top', 'margin-bottom'];

/**
 * @internal
 */
export const quoteProcessor: ElementProcessor<HTMLQuoteElement> = (group, element, context) => {
    if (element.style.borderLeft || element.style.borderRight) {
        stackFormat(
            context,
            {
                paragraph: 'empty',
                segment: 'shallowCloneForBlock',
            },
            () => {
                const quoteFormat: ContentModelBlockFormat = {};
                const segmentFormat: ContentModelSegmentFormat = {};

                parseFormat(element, context.formatParsers.block, quoteFormat, context);
                parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);

        addBlock(group, quote);
        context.elementProcessors.child(quote, element, context);
    } else {
        context.elementProcessors['*'](group, element, context);
    }
};
