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
            // Check if this marker can open or close based on context
            const nextChar = i + marker.length < text.length ? text.charAt(i + marker.length) : '';
            const prevChar = i > 0 ? text.charAt(i - 1) : '';

            // Opening markers: must be followed by non-whitespace
            const canOpen = nextChar.length > 0 && !isWhitespace(nextChar);
            // Closing markers: can always close if there's preceding content (whitespace is allowed)
            const canClose = prevChar.length > 0;

            // Determine if we should toggle based on current state and context
            const currentlyActive = getCurrentFormatState(currentState, marker.type);
            const shouldToggle = (canOpen && !currentlyActive) || (canClose && currentlyActive);

            if (shouldToggle) {
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
                // Treat as regular text if marker is not valid in this context
                currentText += text[i];
                i++;
            }
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

    // If we only have one segment and it's identical to the original (no formatting applied),
    // If no segments were created (e.g., only formatting markers with no content),
    // return the original segment to preserve all properties
    if (
        (textSegments.length === 1 &&
            textSegments[0].text === textSegment.text &&
            !currentState.bold &&
            !currentState.italic &&
            !currentState.strikethrough) ||
        textSegments.length === 0
    ) {
        return [textSegment];
    }

    return textSegments;
}

function parseMarkerAt(text: string, index: number): FormatMarker | null {
    const remaining = text.substring(index);

    if (remaining.startsWith('~~')) {
        return { type: 'strikethrough', length: 2 };
    }

    if (remaining.startsWith('**')) {
        return { type: 'bold', length: 2 };
    }

    if (remaining.startsWith('*')) {
        return { type: 'italic', length: 1 };
    }

    return null;
}

function isWhitespace(char: string): boolean {
    return /\s/.test(char);
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

function getCurrentFormatState(
    state: FormattingState,
    type: 'bold' | 'italic' | 'strikethrough'
): boolean {
    switch (type) {
        case 'bold':
            return state.bold;
        case 'italic':
            return state.italic;
        case 'strikethrough':
            return state.strikethrough;
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
