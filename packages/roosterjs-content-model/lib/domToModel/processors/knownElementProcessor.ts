import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelHeader } from '../../publicTypes/block/ContentModelHeader';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
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
                parseFormat(element, context.formatParsers.link, context.link.format, context);
                parseFormat(element, context.formatParsers.dataset, context.link.dataset, context);
            }

            if (isBlock) {
                parseFormat(element, context.formatParsers.block, context.blockFormat, context);

                const paragraph = createParagraph(false /*isImplicit*/, context.blockFormat);

                if (safeInstanceOf(element, 'HTMLHeadingElement')) {
                    // For headers, inline format won't go into its child nodes, so we parse its format here and clear the format of context
                    paragraph.header = headerProcessor(element, context);

                    Object.assign(context.segmentFormat, paragraph.header.format);
                } else {
                    parseFormat(
                        element,
                        context.formatParsers.segmentOnBlock,
                        context.segmentFormat,
                        context
                    );
                }

                addBlock(group, paragraph);

                // Block format will not be inherited by child blocks, so clear it.
                context.blockFormat = {};
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

function headerProcessor(
    element: HTMLHeadingElement,
    context: DomToModelContext
): ContentModelHeader {
    // Parse the header level from tag name
    // e.g. "H1" will return 1
    const headerLevel = parseInt(element.tagName.substring(1));
    const result: ContentModelHeader = {
        format: {},
        headerLevel,
    };

    parseFormat(element, context.formatParsers.segmentOnBlock, result.format, context);

    return result;
}
