import { ensureParagraph } from 'roosterjs-content-model-dom';
import { setTextSegmentIndex } from '../utils/indexedText';
import {
    ContentModelBlockGroup,
    ContentModelText,
    DomToModelContext,
    ElementProcessor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const textIndexedProcessor: ElementProcessor<Text> = (
    group: ContentModelBlockGroup,
    textNode: Text,
    context: DomToModelContext
) => {
    const paragraph = ensureParagraph(group, context.blockFormat);
    const length = paragraph.segments.length;
    const newTexts: ContentModelText[] = [];

    context.defaultElementProcessors['#text'](group, textNode, context);

    for (let i = length; i < paragraph.segments.length; i++) {
        const segment = paragraph.segments[i];

        if (segment.segmentType == 'Text') {
            newTexts.push(segment);
        }
    }

    setTextSegmentIndex(textNode, paragraph, newTexts);
};
