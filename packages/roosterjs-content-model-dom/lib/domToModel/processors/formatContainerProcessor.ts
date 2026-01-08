import { addBlock } from '../../modelApi/common/addBlock';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { getDefaultStyle } from '../utils/getDefaultStyle';
import { parseFormat } from '../utils/parseFormat';
import { setParagraphNotImplicit } from '../../modelApi/block/setParagraphNotImplicit';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelBlockGroup,
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
    ContentModelParagraph,
    DomToModelContext,
    ElementProcessor,
    MarginFormat,
    PaddingFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const ContextStyles: (keyof (MarginFormat & PaddingFormat))[] = [
    'marginLeft',
    'marginRight',
    'paddingLeft',
    'paddingRight',
];

/**
 * Content Model Element Processor for format container elements (e.g., blockquote, div)
 * Processes elements that create FormatContainer blocks in the content model.
 * This processor can be used in processorOverride to customize how specific elements are processed.
 * @param group The parent block group
 * @param element The DOM element to process
 * @param context DOM to Content Model context
 */
export const formatContainerProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    formatContainerProcessorInternal(group, element, context, false /* forceFormatContainer */);
};

/**
 * @internal
 */
export const forceFormatContainerProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    formatContainerProcessorInternal(group, element, context, true /* forceFormatContainer */);
};

const formatContainerProcessorInternal = (
    group: ContentModelBlockGroup,
    element: HTMLElement,
    context: DomToModelContext,
    forceFormatContainer: boolean
) => {
    stackFormat(context, { segment: 'shallowCloneForBlock', paragraph: 'shallowClone' }, () => {
        parseFormat(element, context.formatParsers.block, context.blockFormat, context);
        parseFormat(element, context.formatParsers.segmentOnBlock, context.segmentFormat, context);

        const format: ContentModelFormatContainerFormat = {
            ...context.blockFormat,
        };

        parseFormat(element, context.formatParsers.container, format, context);

        const tagName =
            getDefaultStyle(element).display == 'block' ? element.tagName.toLowerCase() : 'div';
        const formatContainer = createFormatContainer(tagName, format);

        // It is possible to inherit margin left/right styles from parent DIV or other containers,
        // since we are going into a deeper level of format container now,
        // the container will render these styles so no need to keep them in context format
        ContextStyles.forEach(style => {
            delete context.blockFormat[style];
        });

        context.elementProcessors.child(formatContainer, element, context);

        if (element.style.fontSize && parseInt(element.style.fontSize) == 0) {
            formatContainer.zeroFontSize = true;
        }

        if (shouldFallbackToParagraph(formatContainer) && !forceFormatContainer) {
            // For DIV container that only has one paragraph child, container style can be merged into paragraph
            // and no need to have this container
            const paragraph = formatContainer.blocks[0] as ContentModelParagraph;

            if (formatContainer.zeroFontSize) {
                paragraph.segmentFormat = Object.assign({}, paragraph.segmentFormat, {
                    fontSize: '0',
                });
            }

            Object.assign(paragraph.format, formatContainer.format);
            setParagraphNotImplicit(paragraph);
            addBlock(group, paragraph);
        } else {
            addBlock(group, formatContainer);
        }
    });

    addBlock(group, createParagraph(true /*isImplicit*/, context.blockFormat));
};

function shouldFallbackToParagraph(formatContainer: ContentModelFormatContainer) {
    const firstChild = formatContainer.blocks[0];

    return (
        formatContainer.tagName == 'div' &&
        formatContainer.blocks.length == 1 &&
        firstChild.blockType == 'Paragraph' &&
        firstChild.isImplicit
    );
}
