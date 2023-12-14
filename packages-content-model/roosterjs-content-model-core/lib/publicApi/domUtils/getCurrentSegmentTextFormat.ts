import { ContentModelSegment, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Get the text format of the current selected segment
 * @param currentSegment The segment to get format from
 * @returns
 */
export function getCurrentSegmentTextFormat(
    currentSegment: ContentModelSegment
): ContentModelSegmentFormat {
    const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
        currentSegment?.format ?? {};

    const textFormat: Record<string, string | undefined> = {
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        letterSpacing,
        lineHeight,
    };
    const format: Record<string, string | undefined> = {};
    Object.keys(textFormat).forEach(key => {
        if (textFormat[key] !== undefined) {
            format[key] = textFormat[key];
        }
    });
    return format;
}
