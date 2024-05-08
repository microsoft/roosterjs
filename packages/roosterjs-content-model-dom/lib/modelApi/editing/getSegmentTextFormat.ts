import type {
    ContentModelSegment,
    ContentModelSegmentFormatCommon,
} from 'roosterjs-content-model-types';

/**
 * Get the text format of a segment, this function will return only format that is applicable to text
 * @param segment The segment to get format from
 * @returns
 */
export function getSegmentTextFormat(
    segment: ContentModelSegment
): ContentModelSegmentFormatCommon {
    const { fontFamily, fontSize, textColor, backgroundColor, letterSpacing, lineHeight } =
        segment?.format ?? {};

    const textFormat: ContentModelSegmentFormatCommon = {
        fontFamily,
        fontSize,
        textColor,
        backgroundColor,
        letterSpacing,
        lineHeight,
    };

    return removeUndefinedValues(textFormat);
}

const removeUndefinedValues = (
    format: ContentModelSegmentFormatCommon
): ContentModelSegmentFormatCommon => {
    const textFormat: Record<string, string | undefined | boolean> = {};
    Object.keys(format).filter(key => {
        const value = format[key as keyof ContentModelSegmentFormatCommon];
        if (value !== undefined) {
            textFormat[key] = value;
        }
    });
    return textFormat;
};
