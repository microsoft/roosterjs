import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { createParagraph } from '../../modelApi/creators/createParagraph';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getDefaultStyle } from '../utils/getDefaultStyle';
import { MarginFormat } from '../../publicTypes/format/formatParts/MarginFormat';
import { PaddingFormat } from '../../publicTypes/format/formatParts/PaddingFormat';
import { parseFormat } from '../utils/parseFormat';
import { setParagraphNotImplicit } from '../../modelApi/block/setParagraphNotImplicit';
import { stackFormat } from '../utils/stackFormat';

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
 * @internal
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
            getDefaultStyle(element, context).display == 'block'
                ? element.tagName.toLowerCase()
                : 'div';
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
