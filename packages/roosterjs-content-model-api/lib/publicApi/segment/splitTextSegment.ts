import { createText } from 'roosterjs-content-model-dom';
import type {
    ContentModelText,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Split given text segments from the given range
 * @param textSegment segment to split
 * @param parent parent paragraph the text segment exist in
 * @param start starting point of the split
 * @param end ending point of the split
 * @returns text segment from the indicated split.
 */
export function splitTextSegment(
    textSegment: ContentModelText,
    parent: ShallowMutableContentModelParagraph,
    start: number,
    end: number
): ContentModelText {
    const text = textSegment.text;
    const index = parent.segments.indexOf(textSegment);
    const middleSegment = createText(
        text.substring(start, end),
        textSegment.format,
        textSegment.link,
        textSegment.code
    );

    const newSegments: ContentModelText[] = [middleSegment];
    if (start > 0) {
        newSegments.unshift(
            createText(
                text.substring(0, start),
                textSegment.format,
                textSegment.link,
                textSegment.code
            )
        );
    }
    if (end < text.length) {
        newSegments.push(
            createText(text.substring(end), textSegment.format, textSegment.link, textSegment.code)
        );
    }

    newSegments.forEach(segment => (segment.isSelected = textSegment.isSelected));
    parent.segments.splice(index, 1, ...newSegments);

    return middleSegment;
}
