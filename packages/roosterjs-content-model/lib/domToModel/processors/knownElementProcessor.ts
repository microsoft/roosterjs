import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
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
                parseFormat(
                    element,
                    context.formatParsers.segmentOnBlock,
                    context.segmentFormat,
                    context
                );

                let decorator: ContentModelParagraphDecorator | undefined;

                switch (element.tagName) {
                    case 'P':
                    case 'H1':
                    case 'H2':
                    case 'H3':
                    case 'H4':
                    case 'H5':
                    case 'H6':
                        decorator = createParagraphDecorator(
                            element.tagName,
                            context.segmentFormat
                        );
                        break;
                    default:
                        break;
                }

                const paragraph = createParagraph(
                    false /*isImplicit*/,
                    context.blockFormat,
                    decorator
                );

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
