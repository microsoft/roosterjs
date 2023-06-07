import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContextStyles } from './formatContainerProcessor';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { parseFormat } from '../utils/parseFormat';

const SegmentDecoratorTags = ['A', 'CODE'];

/**
 * @internal
 */
export function blockProcessor(
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext,
    segmentFormat?: ContentModelSegmentFormat
) {
    const decorator = context.blockDecorator.tagName ? context.blockDecorator : undefined;
    const isSegmentDecorator = SegmentDecoratorTags.indexOf(element.tagName) >= 0;

    parseFormat(element, context.formatParsers.block, context.blockFormat, context);

    const blockFormat = { ...context.blockFormat };

    parseFormat(element, context.formatParsers.container, blockFormat, context);

    ContextStyles.forEach(style => {
        if (blockFormat[style]) {
            context.blockFormat[style] = blockFormat[style];
        }
    });

    if (!isSegmentDecorator) {
        const paragraph = createParagraph(
            false /*isImplicit*/,
            blockFormat,
            segmentFormat,
            decorator
        );

        addBlock(group, paragraph);
    }

    context.elementProcessors.child(group, element, context);
}
