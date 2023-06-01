import { addBlock } from '../../modelApi/common/addBlock';
import { blockProcessor } from './blockProcessor';
import { ContentModelSegmentFormat } from 'roosterjs-content-model/lib/publicTypes';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const pProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    stackFormat(context, { blockDecorator: 'empty' }, () => {
        context.blockDecorator = createParagraphDecorator(element.tagName);

        const segmentFormat: ContentModelSegmentFormat = {};

        parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);
        Object.assign(context.segmentFormat, segmentFormat);

        blockProcessor(group, element, context, segmentFormat);
    });

    addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
};
