import { createImageSegment } from '../creators/createImageSegment';
import { createText } from 'roosterjs-content-model-dom';

import type {
    ContentModelLink,
    ContentModelSegment,
    ContentModelSegmentFormat,
    ContentModelText,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
interface FormattingState {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
}

/**
 * @internal
 */
interface FormatMarker {
    type: 'bold' | 'italic' | 'strikethrough';
    length: number;
}

// Matches a markdown link [text](url) anchored at the start of the input.
const linkPattern = /^\[([^\[\]]+)\]\(([^\)]+)\)/;
// Matches a markdown image ![alt](url) anchored at the start of the input.
const imagePattern = /^!\[([^\[\]]+)\]\(([^\)]+)\)/;

/**
 * @internal
 * Parse a markdown inline string into Content Model segments. Supports bold/italic/
 * strikethrough markers, links, and images, and keeps formatting state active across
 * link boundaries (e.g. **[link](url)**).
 */
export function parseInlineSegments(
    text: string,
    segments: ContentModelSegment[],
    state: FormattingState = { bold: false, italic: false, strikethrough: false },
    link?: ContentModelLink
) {
    let buffer = '';
    let i = 0;

    const flushBuffer = () => {
        if (buffer.length > 0) {
            segments.push(createFormattedSegment(buffer, state, link));
            buffer = '';
        }
    };

    while (i < text.length) {
        const remaining = text.substring(i);

        // Escaped character: a backslash followed by an ASCII punctuation character emits
        // that character literally (e.g. "\*" -> "*") and is never treated as a marker.
        if (text[i] === '\\' && i + 1 < text.length && isEscapable(text[i + 1])) {
            buffer += text[i + 1];
            i += 2;
            continue;
        }

        // Image: ![alt](url)
        const imgMatch = imagePattern.exec(remaining);
        if (imgMatch && isValidUrl(imgMatch[2])) {
            flushBuffer();
            segments.push(createImageSegment(imgMatch[1], imgMatch[2]));
            i += imgMatch[0].length;
            continue;
        }

        // Link: [text](url) — keep outer formatting state active inside the link
        const linkMatch = linkPattern.exec(remaining);
        if (linkMatch && isValidUrl(linkMatch[2])) {
            flushBuffer();
            const innerLink: ContentModelLink = {
                dataset: {},
                format: { href: linkMatch[2], underline: true },
            };
            parseInlineSegments(linkMatch[1], segments, state, innerLink);
            i += linkMatch[0].length;
            continue;
        }

        // Formatting marker
        const marker = parseMarkerAt(text, i);
        if (marker && shouldToggleFormatting(text, i, marker, state)) {
            flushBuffer();
            toggleFormatting(state, marker.type);
            i += marker.length;
            continue;
        }

        buffer += text[i];
        i++;
    }

    flushBuffer();
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
    const isCurrentlyActive = getCurrentFormatState(currentState, marker.type);

    if (isCurrentlyActive) {
        return true;
    }

    // Opening marker must be followed by a non-whitespace character.
    const nextIndex = index + marker.length;
    const nextChar = nextIndex < text.length ? text.charAt(nextIndex) : '';

    if (nextChar.length === 0 || isWhitespace(nextChar)) {
        return false;
    }

    return true;
}

function isWhitespace(char: string): boolean {
    return /\s/.test(char);
}

function isEscapable(char: string): boolean {
    // Per CommonMark, any ASCII punctuation character may be backslash-escaped.
    return /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(char);
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
    state: FormattingState,
    link?: ContentModelLink
): ContentModelText {
    const format: ContentModelSegmentFormat = {};

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

function isValidUrl(url: string): boolean {
    if (!url) {
        return false;
    }

    if (
        url.startsWith('data:') ||
        url.startsWith('blob:') ||
        url.startsWith('/') ||
        url.startsWith('./') ||
        url.startsWith('../')
    ) {
        return true;
    }

    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
        return false;
    }
}
