// Matches markdown links and images in a string.
// Group 1 (full link):  [text](url)       e.g. [Click here](https://example.com)
//   Group 2: link text  e.g. "Click here"
//   Group 3: link url   e.g. "https://example.com"
// Group 4 (full image): ![alt](url)       e.g. ![Logo](https://example.com/logo.png)
//   Group 5: alt text   e.g. "Logo"
//   Group 6: image url  e.g. "https://example.com/logo.png"
const linkRegex = /(\[([^\[]+)\]\(([^\)]+)\))|(\!\[([^\[]+)\]\(([^\)]+)\))/g;

/**
 * @internal
 */
interface MarkdownSegment {
    text: string;
    url: string;
    type: 'text' | 'link' | 'image';
}

const isValidUrl = (url: string) => {
    if (!url) {
        return false;
    }

    // Accept common non-http schemes and relative paths
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
};

function pushText(result: MarkdownSegment[], text: string) {
    const last = result[result.length - 1];
    if (last && last.type === 'text') {
        last.text += text;
    } else {
        result.push({ type: 'text', text, url: '' });
    }
}

/**
 * @internal
 */
export function splitParagraphSegments(text: string): MarkdownSegment[] {
    const result: MarkdownSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = linkRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            pushText(result, text.slice(lastIndex, match.index));
        }

        if (match[2] && match[3]) {
            if (isValidUrl(match[3])) {
                result.push({ type: 'link', text: match[2], url: match[3] });
            } else {
                pushText(result, match[0]);
            }
        } else if (match[5] && match[6]) {
            if (isValidUrl(match[6])) {
                result.push({ type: 'image', text: match[5], url: match[6] });
            } else {
                pushText(result, match[0]);
            }
        }

        lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        pushText(result, text.slice(lastIndex));
    }

    return result;
}
