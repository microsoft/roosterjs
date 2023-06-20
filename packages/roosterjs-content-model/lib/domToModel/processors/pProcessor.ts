import { addBlock } from '../../modelApi/common/addBlock';
import { blockProcessor } from './blockProcessor';
import { ContentModelSegmentFormat, ElementProcessor } from 'roosterjs-content-model-types';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const pProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(
        context,
        { blockDecorator: 'empty', segment: 'shallowCloneForBlock', paragraph: 'shallowClone' },
        () => {
            context.blockDecorator = createParagraphDecorator(element.tagName);

            const segmentFormat: ContentModelSegmentFormat = {};

            parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);
            Object.assign(context.segmentFormat, segmentFormat);

            blockProcessor(group, element, context, segmentFormat);
        }
    );

    addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
};
