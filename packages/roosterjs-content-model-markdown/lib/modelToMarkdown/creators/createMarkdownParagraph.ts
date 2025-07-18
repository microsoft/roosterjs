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
    let markdownString = text.text;
    if (text.link) {
        markdownString = `[${text.text}](${text.link.format.href})`;
    }
    if (text.format.fontWeight == 'bold') {
        markdownString = `**${markdownString}**`;
    }
    if (text.format.italic) {
        markdownString = `*${markdownString}*`;
    }
    return markdownString;
}
