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

    // Quick check: if the text contains only formatting markers, return original
    if (isOnlyFormattingMarkers(text)) {
        return [textSegment];
    }

    const textSegments: ContentModelText[] = [];
    const currentState: FormattingState = { bold: false, italic: false, strikethrough: false };

    let currentText = '';
    let i = 0;

    while (i < text.length) {
        const marker = parseMarkerAt(text, i);

        if (marker) {
            // Check if this marker should be treated as formatting or as literal text
            if (shouldToggleFormatting(text, i, marker, currentState)) {
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

    // If no meaningful formatting was applied, return the original segment
    if (
        textSegments.length === 0 ||
        (textSegments.length === 1 && textSegments[0].text === textSegment.text)
    ) {
        return [textSegment];
    }

    return textSegments;
}

function isOnlyFormattingMarkers(text: string): boolean {
    // Remove all potential formatting markers and see if anything remains
    let remaining = text;
    remaining = remaining.replace(/\*\*/g, ''); // Remove **
    remaining = remaining.replace(/~~/g, ''); // Remove ~~
    remaining = remaining.replace(/\*/g, ''); // Remove *

    // If nothing remains after removing all markers, it was only markers
    return remaining.length === 0;
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

function shouldToggleFormatting(
    text: string,
    index: number,
    marker: FormatMarker,
    currentState: FormattingState
): boolean {
    const nextChar = index + marker.length < text.length ? text.charAt(index + marker.length) : '';

    const isCurrentlyActive = getCurrentFormatState(currentState, marker.type);

    if (isCurrentlyActive) {
        // We're currently in this format, so any marker can close it
        return true;
    } else {
        // We're not in this format, so this marker would open it
        // Opening markers must be followed by non-whitespace
        return nextChar.length > 0 && !isWhitespace(nextChar);
    }
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
