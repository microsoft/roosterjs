import { addBlock } from '../../modelApi/common/addBlock';
import { ContextStyles } from './formatContainerProcessor';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { parseFormat } from '../utils/parseFormat';

const SegmentDecoratorTags = ['A', 'CODE'];

/**
 * @internal
 */
export const blockProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const decorator = context.blockDecorator.tagName ? context.blockDecorator : undefined;
    const isSegmentDecorator = SegmentDecoratorTags.indexOf(element.tagName) >= 0;

    parseFormat(element, context.formatParsers.block, context.blockFormat, context);

    const format = { ...context.blockFormat };

    parseFormat(element, context.formatParsers.container, format, context);

    ContextStyles.forEach(style => {
        if (format[style]) {
            context.blockFormat[style] = format[style];
        }
    });

    if (!isSegmentDecorator) {
        const paragraph = createParagraph(false /*isImplicit*/, format, decorator);

        if (element.style.fontSize && parseInt(element.style.fontSize) == 0) {
            paragraph.zeroFontSize = true;
        }

        addBlock(group, paragraph);
    }

    context.elementProcessors.child(group, element, context);
};
