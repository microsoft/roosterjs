import type { ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applyLink(
    textSegment: ContentModelText,
    text: string,
    url: string
): ContentModelText {
    textSegment.text = text;
    textSegment.link = {
        dataset: {},
        format: {
            href: url,
            underline: true,
        },
    };

    return textSegment;
}
