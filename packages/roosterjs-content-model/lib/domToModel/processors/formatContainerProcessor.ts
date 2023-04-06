import { addBlock } from '../../modelApi/common/addBlock';
import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createFormatContainer } from '../../modelApi/creators/createFormatContainer';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { knownElementProcessor } from './knownElementProcessor';
import { parseFormat } from '../utils/parseFormat';
import { stackFormat } from '../utils/stackFormat';

// This only used for generate a full list of segment format key, so the values can be just null since we will never use them
const RequiredSegmentFormat: Required<ContentModelSegmentFormat> = {
    backgroundColor: null!,
    fontFamily: null!,
    fontSize: null!,
    fontWeight: null!,
    italic: null!,
    lineHeight: null!,
    strikethrough: null!,
    superOrSubScriptSequence: null!,
    textColor: null!,
    underline: null!,
};
const AllSegmentFormatKeys = getObjectKeys(RequiredSegmentFormat);

/**
 * @internal
 */
export const formatContainerProcessor: ElementProcessor<HTMLElement> = (
    group,
    element,
    context
) => {
    const tagName = element.tagName.toLowerCase();

    if (tagName == 'pre' || tagName == 'blockquote') {
        stackFormat(
            context,
            {
                paragraph: 'shallowCopyInherit',
                segment: 'shallowCloneForBlock',
            },
            () => {
                const format: ContentModelBlockFormat & ContentModelSegmentFormat = {
                    ...context.blockFormat,
                };

                parseFormat(element, context.formatParsers.block, format, context);
                parseFormat(element, context.formatParsers.segmentOnBlock, format, context);

                const container = createFormatContainer(tagName, format);

                addBlock(group, container);

                // These inline formats are overridden by quote, and will be applied onto BLOCKQUOTE element
                // So no need to pass them down into segments.
                // And when toggle blockquote (unwrap the quote model), no need to modify the inline format of segments
                AllSegmentFormatKeys.forEach(key => {
                    if (format[key] !== undefined) {
                        delete context.segmentFormat[key];
                    }
                });

                context.elementProcessors.child(container, element, context);
            }
        );
    }
};

/**
 * @internal
 */
export const quoteProcessor: ElementProcessor<HTMLQuoteElement> = (group, element, context) => {
    const processor =
        element.style.borderLeft || element.style.borderRight
            ? formatContainerProcessor
            : knownElementProcessor;

    processor(group, element, context);
};
