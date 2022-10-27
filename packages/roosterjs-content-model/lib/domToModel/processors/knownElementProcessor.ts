import { addBlock } from '../../modelApi/common/addBlock';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    if (isBlockElement(element, context)) {
        stackFormat(
            context,
            {
                segment: 'shallowClone',
                paragraph: 'shallowClone',
            },
            () => {
                parseFormat(element, context.formatParsers.block, context.blockFormat, context);
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                const block = createParagraph(false /*isImplicit*/, context.blockFormat);

                if (safeInstanceOf(element, 'HTMLHeadingElement')) {
                    block.headerLevel = getHeaderLevel(element);
                }

                addBlock(group, block);

                context.elementProcessors.child(group, element, context);
            }
        );

        addBlock(group, createParagraph(false /*isImplicit*/, context.blockFormat));
    } else {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            context.elementProcessors.child(group, element, context);
        });
    }
};

function getHeaderLevel(element: HTMLHeadingElement): number | undefined {
    // Parse the header level from tag name
    // e.g. "H1" will return 1
    const headerLevel = parseInt(element.tagName.substring(1));

    return headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined;
}
