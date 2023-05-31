import { addBlock } from '../../modelApi/common/addBlock';
import { blockProcessor } from './blockProcessor';
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

        parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);

        blockProcessor(group, element, context);
    });

    addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
};
