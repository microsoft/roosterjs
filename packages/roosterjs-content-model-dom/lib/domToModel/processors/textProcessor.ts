import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
import { stackFormat } from '../utils/stackFormat';
import type {
    ContentModelBlockGroup,
    ContentModelText,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textProcessor: ElementProcessor<Text> = (
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) => {
    if (context.formatParsers.text.length > 0) {
        stackFormat(context, { segment: 'shallowClone' }, () => {
            context.formatParsers.text.forEach(parser => {
                parser(context.segmentFormat, textNode, context);
            });
            internalTextProcessor(group, textNode, context);
        });
    } else {
        internalTextProcessor(group, textNode, context);
    }
};

function internalTextProcessor(
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) {
    const paragraph = ensureParagraph(group, context.blockFormat);
    const segmentCount = paragraph.segments.length;

    context.elementProcessors.textWithSelection(group, textNode, context);

    const newSegments = paragraph.segments.slice(segmentCount);
    context.domIndexer?.onSegment(
        textNode,
        paragraph,
        newSegments.filter((x): x is ContentModelText => x?.segmentType == 'Text')
    );
}
