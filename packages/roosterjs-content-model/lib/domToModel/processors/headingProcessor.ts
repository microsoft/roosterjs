import { addBlock } from '../../modelApi/common/addBlock';
import { blockProcessor } from './blockProcessor';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const headingProcessor: ElementProcessor<HTMLHeadingElement> = (group, element, context) => {
    stackFormat(
        context,
        { segment: 'shallowCloneForBlock', paragraph: 'shallowClone', blockDecorator: 'empty' },
        () => {
            const segmentFormat: ContentModelSegmentFormat = {};

            parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);

            context.blockDecorator = createParagraphDecorator(element.tagName, segmentFormat);

            blockProcessor(group, element, context);
        }
    );

    addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
};
