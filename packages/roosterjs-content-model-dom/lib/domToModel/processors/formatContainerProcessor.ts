import { addBlock } from '../../modelApi/common/addBlock';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { getDefaultStyle } from '../utils/getDefaultStyle';
import { parseFormat } from '../utils/parseFormat';
import { setParagraphNotImplicit } from '../../modelApi/block/setParagraphNotImplicit';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
    ContentModelParagraph,
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
 * Content Model Element Processor for format container
 *
 * This processor converts DOM elements into FormatContainer blocks in the content model.
 * It can be used in processorOverride to force certain elements (like blockquote with zero margins)
 * to always be processed as format containers, even when they don't meet the default criteria.
 *
 * @example
 * ```typescript
 * // Force blockquote elements to always use formatContainerProcessor
 * const domToModelOption: DomToModelOption = {
 *   processorOverride: {
 *     blockquote: formatContainerProcessor
 *   }
 * };
 * ```
 *
 * @param group The parent block group
 * @param element Parent DOM node to process
 * @param context DOM to Content Model context
 */
export const formatContainerProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
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

        if (shouldFallbackToParagraph(formatContainer)) {
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
