import { MarkdownHeadings } from '../../constants/headings';
import type { ContentModelParagraph, ContentModelText } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export interface ParagraphContext {
    ignoreLineBreaks: boolean;
}

/**
 * @internal
 */
export function createMarkdownParagraph(
    paragraph: ContentModelParagraph,
    context?: ParagraphContext
): string {
    const { segments } = paragraph;
    let markdownString = '';
    for (const segment of segments) {
        switch (segment.segmentType) {
            case 'Text':
                markdownString += textProcessor(segment);
                break;
            case 'Image':
                markdownString += `![${segment.alt || 'image'}](${segment.src})`;
                break;
            case 'Br':
                if (!context?.ignoreLineBreaks) {
                    markdownString += '\n';
                }
                break;
            default:
                break;
        }
    }

    if (paragraph.decorator) {
        const { tagName } = paragraph.decorator;
        const prefix = MarkdownHeadings[tagName];
        if (prefix) {
            markdownString = `${prefix}${markdownString}`;
        }
    }

    return markdownString;
}

function textProcessor(text: ContentModelText): string {
    const { fontWeight, italic, strikethrough } = text.format;
    const hasInlineFormat = fontWeight == 'bold' || italic || strikethrough;

    if (!hasInlineFormat) {
        return text.link ? `[${text.text}](${text.link.format.href})` : text.text;
    }

    // Move leading/trailing whitespace outside the markers so the emitted
    // markdown is valid (CommonMark requires emphasis markers to hug
    // non-whitespace), e.g. "world " with <b> => " " + "**world**".
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(text.text);
    const [, leading, core, trailing] = match ? match : ['', '', text.text, ''];

    if (!core) {
        return text.text;
    }

    let inner = text.link ? `[${core}](${text.link.format.href})` : core;
    if (fontWeight == 'bold') {
        inner = `**${inner}**`;
    }
    if (strikethrough) {
        inner = `~~${inner}~~`;
    }
    if (italic) {
        inner = `*${inner}*`;
    }

    return `${leading}${inner}${trailing}`;
}
