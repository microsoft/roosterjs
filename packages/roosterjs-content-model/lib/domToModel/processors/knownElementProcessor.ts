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
    const isBlock = isBlockElement(element, context);
    const isLink = element.tagName == 'A';

    stackFormat(
        context,
        {
            segment: 'shallowClone',
            paragraph: 'shallowClone',
            link: isLink ? 'empty' : undefined,
        },
        () => {
            if (isLink) {
                context.linkFormat.format = {};
                parseFormat(
                    element,
                    context.formatParsers.link,
                    context.linkFormat.format,
                    context
                );
            }

            if (isBlock) {
                parseFormat(element, context.formatParsers.block, context.blockFormat, context);
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                const paragraph = createParagraph(false /*isImplicit*/, context.blockFormat);

                if (safeInstanceOf(element, 'HTMLHeadingElement')) {
                    paragraph.headerLevel = getHeaderLevel(element);
                }

                addBlock(group, paragraph);
            } else {
                parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            }

            context.elementProcessors.child(group, element, context);
        }
    );

    if (isBlock) {
        addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
    }
};

function getHeaderLevel(element: HTMLHeadingElement): number | undefined {
    // Parse the header level from tag name
    // e.g. "H1" will return 1
    const headerLevel = parseInt(element.tagName.substring(1));

    return headerLevel >= 1 && headerLevel <= 6 ? headerLevel : undefined;
}
