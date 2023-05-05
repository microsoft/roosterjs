import { addBlock } from '../../modelApi/common/addBlock';
import { ContextStyles, formatContainerProcessor } from './formatContainerProcessor';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getDefaultStyle } from '../utils/getDefaultStyle';
import { isBlockElement } from '../utils/isBlockElement';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

const FormatContainerTriggerStyles: (keyof CSSStyleDeclaration)[] = [
    'marginBottom',
    'marginTop',
    'paddingBottom',
    'paddingTop',
    'paddingLeft',
    'paddingRight',
    'borderTopWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'width',
    'height',
    'maxWidth',
    'maxHeight',
    'minWidth',
    'minHeight',
];
const ByPassFormatContainerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const isBlock = isBlockElement(element, context);

    if (isBlock && shouldUseFormatContainer(element, context)) {
        formatContainerProcessor(group, element, context);
    } else if (isBlock) {
        const decorator = context.blockDecorator.tagName ? context.blockDecorator : undefined;

        stackFormat(context, { segment: 'shallowCloneForBlock', paragraph: 'shallowClone' }, () => {
            parseFormat(element, context.formatParsers.block, context.blockFormat, context);

            const format = { ...context.blockFormat };

            parseFormat(element, context.formatParsers.container, format, context);
            parseFormat(
                element,
                context.formatParsers.segmentOnBlock,
                context.segmentFormat,
                context
            );

            ContextStyles.forEach(style => {
                if (format[style]) {
                    context.blockFormat[style] = format[style];
                }
            });

            const paragraph = createParagraph(false /*isImplicit*/, format, decorator);

            if (element.style.fontSize && parseInt(element.style.fontSize) == 0) {
                paragraph.zeroFontSize = true;
            }

            addBlock(group, paragraph);
            context.elementProcessors.child(group, element, context);
        });

        if (isBlock) {
            addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat, decorator));
        }
    } else {
        stackFormat(context, { segment: 'shallowClone', paragraph: 'shallowClone' }, () => {
            parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

            context.elementProcessors.child(group, element, context);
        });
    }
};

function shouldUseFormatContainer(element: HTMLElement, context: DomToModelContext) {
    // For those tags that we know we should not use format container, just return false
    if (ByPassFormatContainerTags.indexOf(element.tagName.toLowerCase()) >= 0) {
        return false;
    }

    const style = element.style;
    const defaultStyle = getDefaultStyle(element, context);

    const bgcolor = style.getPropertyValue('background-color');

    // For block element with background, we need to use format container
    if (bgcolor && bgcolor != 'transparent') {
        return true;
    }

    // For block element with positive value of border width or top/bottom margin/padding,
    // we need to use format container
    if (
        FormatContainerTriggerStyles.some(
            key => parseInt((style[key] as string) || (defaultStyle[key] as string) || '') > 0
        )
    ) {
        return true;
    }

    return false;
}
