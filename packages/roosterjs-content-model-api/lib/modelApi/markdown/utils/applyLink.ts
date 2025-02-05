import type { ContentModelText } from 'roosterjs-content-model-types';

const linkRegex = /\[([^\[]+)\]\((https?:\/\/[^\)]+)\)/g;

/**
 * @internal
 */
export function applyLink(textSegment: ContentModelText): ContentModelText | undefined {
    const text = textSegment.text;
    const markdownLink = linkRegex.exec(text);
    if (markdownLink) {
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
