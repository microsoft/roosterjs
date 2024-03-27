import { createText } from 'roosterjs-content-model-dom';
import type { ContentModelSegmentFormat, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function splitTextSegment(
    text: string,
    start: number,
    end?: number,
    format?: ContentModelSegmentFormat
): ContentModelText {
    const newText = text.substring(start, end);
    const newSegment = createText(newText, format);
    return newSegment;
}
