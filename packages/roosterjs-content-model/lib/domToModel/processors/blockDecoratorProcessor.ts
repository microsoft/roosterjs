import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const blockDecoratorProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(context, { blockDecorator: 'empty' }, () => {
        const segmentFormat: ContentModelSegmentFormat = {};

        parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);

        context.blockDecorator = createParagraphDecorator(element.tagName, segmentFormat);

        knownElementProcessor(group, element, context);
    });
};
