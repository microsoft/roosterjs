const linkRegex = /(\[([^\[]+)\]\((https?:\/\/[^\)]+)\))|(\!\[([^\[]+)\]\((https?:\/\/[^\)]+)\))/g;

/**
 * @internal
 */
interface MarkdownSegment {
    text: string;
    url: string;
    type: 'text' | 'link' | 'image';
}

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

/**
 * @internal
 */
export function splitParagraphSegments(text: string): MarkdownSegment[] {
    const result: MarkdownSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = linkRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            result.push({ type: 'text', text: text.slice(lastIndex, match.index), url: '' });
        }

        if (match[2] && match[3]) {
            result.push(
                isValidUrl(match[3])
                    ? { type: 'link', text: match[2], url: match[3] }
                    : { type: 'text', text: match[0], url: '' }
            );
        } else if (match[5] && match[6]) {
            result.push(
                isValidUrl(match[6])
                    ? { type: 'image', text: match[5], url: match[6] }
                    : { type: 'text', text: match[0], url: '' }
            );
        }

        lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        result.push({ type: 'text', text: text.slice(lastIndex), url: '' });
    }

    return result;
}
