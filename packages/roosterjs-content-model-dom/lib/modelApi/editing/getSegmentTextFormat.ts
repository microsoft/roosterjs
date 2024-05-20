import type { ContentModelSegment, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Get the text format of a segment, this function will return only format that is applicable to text
 * @param segment The segment to get format from
 * @returns
 */
export function getSegmentTextFormat(segment: ContentModelSegment): ContentModelSegmentFormat {
    const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
        segment?.format ?? {};

    const textFormat: ContentModelSegmentFormat = {
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        letterSpacing,
        lineHeight,
    };

    return removeUndefinedValues(textFormat);
}

const removeUndefinedValues = (format: ContentModelSegmentFormat): ContentModelSegmentFormat => {
    const textFormat: Record<string, string | undefined | boolean | never[]> = {};
    Object.keys(format).filter(key => {
        const value = format[key as keyof ContentModelSegmentFormat];

        if (value !== undefined) {
            textFormat[key] = value;
        }
    });
    return textFormat;
};
