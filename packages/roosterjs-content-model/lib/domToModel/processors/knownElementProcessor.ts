import { addBlock } from '../../modelApi/common/addBlock';
import { blockProcessor } from './blockProcessor';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { formatContainerProcessor } from './formatContainerProcessor';
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
const ByPassFormatContainerTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'A'];
const SegmentDecoratorTags = ['A', 'CODE'];

/**
 * @internal
 */
export const knownElementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const isBlock = isBlockElement(element, context);

    if (
        (isBlock || element.style.display == 'inline-block') && // For inline-block here, we will also check if it should be represented as Format Container
        shouldUseFormatContainer(element, context)
    ) {
        formatContainerProcessor(group, element, context);
    } else if (isBlock) {
        const decorator = context.blockDecorator.tagName ? context.blockDecorator : undefined;
        const isSegmentDecorator = SegmentDecoratorTags.indexOf(element.tagName) >= 0;

        stackFormat(context, { segment: 'shallowCloneForBlock', paragraph: 'shallowClone' }, () => {
            const segmentFormat: ContentModelSegmentFormat = {};

            parseFormat(element, context.formatParsers.segmentOnBlock, segmentFormat, context);
            Object.assign(context.segmentFormat, segmentFormat);

            blockProcessor(group, element, context, segmentFormat);
        });

        if (isBlock && !isSegmentDecorator) {
            addBlock(
                group,
                createParagraph(
                    true /*isImplicit*/,
                    context.blockFormat,
                    undefined /*segmentFormat*/,
                    decorator
                )
            );
        }
    } else {
        stackFormat(
            context,
            {
                segment: 'shallowClone',
                paragraph: 'shallowClone',
                link: 'cloneFormat',
            },
            () => {
                parseFormat(element, context.formatParsers.segment, context.segmentFormat, context);

                if (context.link.format.href && element.tagName != 'A') {
                    parseFormat(
                        element,
                        context.formatParsers.segmentUnderLink,
                        context.link.format,
                        context
                    );
                }

                context.elementProcessors.child(group, element, context);
            }
        );
    }
};

function shouldUseFormatContainer(element: HTMLElement, context: DomToModelContext) {
    // For those tags that we know we should not use format container, just return false
    if (ByPassFormatContainerTags.indexOf(element.tagName) >= 0) {
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

    // For margin left/right with value "auto", we need to use format container
    if (style.marginLeft == 'auto' || style.marginRight == 'auto') {
        return true;
    }

    // For element with "align" attribute, we need to use format container
    if (element.getAttribute('align')) {
        return true;
    }

    return false;
}
