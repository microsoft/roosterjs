import { createText } from 'roosterjs-content-model-dom';
import type {
    ContentModelLink,
    ContentModelSegmentFormat,
    ContentModelText,
} from 'roosterjs-content-model-types';

interface FormattingState {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
}

interface FormatMarker {
    type: 'bold' | 'italic' | 'strikethrough';
    length: number;
}

/**
 * @internal
 */
export function applyTextFormatting(textSegment: ContentModelText) {
    const text = textSegment.text;
    const textSegments: ContentModelText[] = [];
    const currentState: FormattingState = { bold: false, italic: false, strikethrough: false };

    let currentText = '';
    let i = 0;

    while (i < text.length) {
        const marker = parseMarkerAt(text, i);

        if (marker) {
            // If we have accumulated text, create a segment for it
            if (currentText.length > 0) {
                textSegments.push(
                    createFormattedSegment(
                        currentText,
                        textSegment.format,
                        currentState,
                        textSegment.link
                    )
                );
                currentText = '';
            }

            // Toggle the formatting state
            toggleFormatting(currentState, marker.type);

            // Skip the marker characters
            i += marker.length;
        } else {
            // Regular character, add to current text
            currentText += text[i];
            i++;
        }
    }

    // Add any remaining text as a final segment
    if (currentText.length > 0) {
        textSegments.push(
            createFormattedSegment(currentText, textSegment.format, currentState, textSegment.link)
        );
    }

    return textSegments.length > 0 ? textSegments : [textSegment];
}

function parseMarkerAt(text: string, index: number): FormatMarker | null {
    const remaining = text.substring(index);

    // Check for strikethrough (~~)
    if (remaining.startsWith('~~')) {
        return { type: 'strikethrough', length: 2 };
    }

    // Check for bold (**)
    if (remaining.startsWith('**')) {
        return { type: 'bold', length: 2 };
    }

    // Check for italic (*)
    if (remaining.startsWith('*')) {
        return { type: 'italic', length: 1 };
    }

    return null;
}

function toggleFormatting(state: FormattingState, type: 'bold' | 'italic' | 'strikethrough'): void {
    switch (type) {
        case 'bold':
            state.bold = !state.bold;
            break;
        case 'italic':
            state.italic = !state.italic;
            break;
        case 'strikethrough':
            state.strikethrough = !state.strikethrough;
            break;
    }
}

function createFormattedSegment(
    text: string,
    baseFormat: ContentModelSegmentFormat,
    state: FormattingState,
    link?: ContentModelLink
): ContentModelText {
    const format: ContentModelSegmentFormat = { ...baseFormat };

    if (state.bold) {
        format.fontWeight = 'bold';
    }

    if (state.italic) {
        format.italic = true;
    }

    if (state.strikethrough) {
        format.strikethrough = true;
    }

    return createText(text, format, link);
}
