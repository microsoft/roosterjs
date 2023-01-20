import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createQuote } from '../../modelApi/creators/createQuote';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

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

                const quote = createQuote(quoteFormat, segmentFormat);

                addBlock(group, quote);

                // These inline formats are overridden by quote, and will be applied onto BLOCKQUOTE element
                // So no need to pass them down into segments.
                // And when toggle blockquote (unwrap the quote model), no need to modify the inline format of segments
                getObjectKeys(segmentFormat).forEach(key => {
                    delete context.segmentFormat[key];
                });

                context.elementProcessors.child(quote, element, context);
            }
        );
    } else {
        knownElementProcessor(group, element, context);
    }
};
