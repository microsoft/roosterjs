import { createText } from 'roosterjs-content-model-dom';
import type { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function splitTextSegment(
    textSegment: ContentModelText,
    parent: ContentModelParagraph,
    start: number,
    end: number
): ContentModelText {
    const text = textSegment.text;
    const index = parent.segments.indexOf(textSegment);
    const textBefore = createText(
        text.substring(0, start),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );
    const middleText = createText(
        text.substring(start, end),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );
    const textAfter = createText(
        text.substring(end),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );
    textBefore.isSelected = textSegment.isSelected;
    middleText.isSelected = textSegment.isSelected;
    textAfter.isSelected = textSegment.isSelected;

    parent.segments.splice(index, 1, textBefore);
    parent.segments.splice(index + 1, 0, middleText);
    parent.segments.splice(index + 2, 0, textAfter);

    return middleText;
}
