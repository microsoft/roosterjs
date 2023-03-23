import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelDivider } from '../../publicTypes/block/ContentModelDivider';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { createDivider } from '../../modelApi/creators/createDivider';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { createParagraphDecorator } from '../../modelApi/creators/createParagraphDecorator';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { extractBorderValues } from '../../domUtils/borderValues';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const isBlock = isBlockElement(element, context);
    const isLink = element.tagName == 'A' && element.hasAttribute('href');
    const isCode = element.tagName == 'CODE';

    stackFormat(
        context,
        {
            segment: isBlock ? 'shallowCloneForBlock' : 'shallowClone',
            paragraph: 'shallowClone',
        },
        () => {
            let topDivider: ContentModelDivider | undefined;
            let bottomDivider: ContentModelDivider | undefined;

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
                        topDivider = tryCreateDivider(context.blockFormat, true /*isTop*/);
                        bottomDivider = tryCreateDivider(context.blockFormat, false /*isBottom*/);

                        break;
                }

                const paragraph = createParagraph(
                    false /*isImplicit*/,
                    context.blockFormat,
                    decorator
                );

                if (topDivider) {
                    if (context.isInSelection) {
                        topDivider.isSelected = true;
                    }

                    addBlock(group, topDivider);
                }

                addBlock(group, paragraph);
            } else {
                parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);
            }

            if (isCode) {
                stackFormat(context, { code: 'codeDefault' }, () => {
                    parseFormat(element, context.formatParsers.code, context.code.format, context);

                    context.elementProcessors.child(group, element, context);
                });
            } else if (isLink) {
                stackFormat(context, { link: 'linkDefault' }, () => {
                    parseFormat(element, context.formatParsers.link, context.link.format, context);
                    parseFormat(
                        element,
                        context.formatParsers.dataset,
                        context.link.dataset,
                        context
                    );

                    context.elementProcessors.child(group, element, context);
                });
            } else {
                context.elementProcessors.child(group, element, context);
            }

            if (bottomDivider) {
                if (context.isInSelection) {
                    bottomDivider.isSelected = true;
                }

                addBlock(group, bottomDivider);
            }
        }
    );

    if (isBlock) {
        addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
    }
};

function tryCreateDivider(
    format: ContentModelBlockFormat,
    isTop: boolean
): ContentModelDivider | undefined {
    const marginName: keyof ContentModelBlockFormat = isTop ? 'marginTop' : 'marginBottom';
    const paddingName: keyof ContentModelBlockFormat = isTop ? 'paddingTop' : 'paddingBottom';
    const borderName: keyof ContentModelBlockFormat = isTop ? 'borderTop' : 'borderBottom';

    const marginNumber = parseInt(format[marginName] || '');
    const paddingNumber = parseInt(format[paddingName] || '');
    const borderString = format[borderName];

    let result: ContentModelDivider | undefined;

    if (marginNumber > 0 || paddingNumber > 0 || borderString) {
        result = createDivider('div');

        if (marginNumber > 0) {
            result.format[marginName] = format[marginName];
        }

        if (paddingNumber > 0) {
            result.format[paddingName] = format[paddingName];
        }

        if (borderString) {
            const border = extractBorderValues(borderString);

            if (border.style && border.style != 'none') {
                result.format[borderName] = borderString;
            }
        }
    }

    delete format[marginName];
    delete format[paddingName];
    delete format[borderName];

    return result;
}
