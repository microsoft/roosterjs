import type { ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function applyLink(textSegment: ContentModelText): ContentModelText {
    const linkRegex = /\[([^\[]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    const text = textSegment.text;
    const markdownLink = linkRegex.exec(text);
    if (markdownLink && markdownLink.length == 3) {
        textSegment.text = markdownLink[1];
        textSegment.link = {
            dataset: {},
            format: {
                href: markdownLink[2],
                underline: true,
            },
        };
    }

    return textSegment;
}
