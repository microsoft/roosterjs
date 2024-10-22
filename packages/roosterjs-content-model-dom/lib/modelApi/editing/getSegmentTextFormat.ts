import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Get the text format of a segment, this function will return only format that is applicable to text
 * @param segment The segment to get format from
 * @param includingBIU When pass true, also get Bold/Italic/Underline format
 * @returns
 */
export function getSegmentTextFormat(
    segment: ReadonlyContentModelSegment,
    includingBIU?: boolean
): ContentModelSegmentFormat {
    const format = segment.format ?? {};
    const textFormat: ContentModelSegmentFormat = {
        fontFamily: format.fontFamily,
        fontSize: format.fontSize,
        textColor: format.textColor,
        backgroundColor: format.backgroundColor,
        letterSpacing: format.letterSpacing,
        lineHeight: format.lineHeight,
        fontWeight: includingBIU ? format.fontWeight : undefined,
        italic: includingBIU ? format.italic : undefined,
        underline: includingBIU ? format.underline : undefined,
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
