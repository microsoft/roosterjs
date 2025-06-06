import { createText } from 'roosterjs-content-model-dom';
import type {
    ContentModelLink,
    ContentModelSegmentFormat,
    ContentModelText,
} from 'roosterjs-content-model-types';

const SPLIT_PATTERN = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/;

/**
 * @internal
 */
export function applyTextFormatting(textSegment: ContentModelText) {
    const texts = splitSegments(textSegment.text);
    const textSegments: ContentModelText[] = [];
    for (const text of texts) {
        textSegments.push(createFormattedSegment(text, textSegment.format, textSegment.link));
    }
    return textSegments;
}

function splitSegments(text: string): string[] {
    return text.split(SPLIT_PATTERN).filter(s => s.trim().length > 0);
}

function createFormattedSegment(
    text: string,
    format: ContentModelSegmentFormat,
    link?: ContentModelLink
): ContentModelText {
    if (text.startsWith('***') && text.endsWith('***')) {
        format = { ...format, fontWeight: 'bold', italic: true };
        text = text.replace(/\*\*\*/g, '');
        text = text + ' ';
    } else if (text.startsWith('**') && text.endsWith('**')) {
        format = { ...format, fontWeight: 'bold' };
        text = text.replace(/\*\*/g, '');
        text = text + ' ';
    } else if (text.startsWith('*') && text.endsWith('*')) {
        format = { ...format, italic: true };
        text = text.replace(/\*/g, '');
        text = text + ' ';
    }

    return createText(text, format, link);
}
