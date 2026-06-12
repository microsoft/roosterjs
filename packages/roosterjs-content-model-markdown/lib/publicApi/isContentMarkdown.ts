// Block-level markdown patterns. A line that matches any of these is considered markdown.
const BlockPatterns: RegExp[] = [
    /^#{1,6}\s.+/, // heading: "# text" .. "###### text"
    /^\s*>\s.+/, // blockquote: "> text"
    /^\s*[\*\-\+]\s.+/, // unordered list: "- item", "* item", "+ item"
    /^\s*\d+\.\s.+/, // ordered list: "1. item"
    /^---+$/, // horizontal rule: "---"
    /^\s*\|.*\|\s*$/, // table row: "| a | b |"
];

// Inline markdown patterns. The text contains markdown if any of these match anywhere.
const InlinePatterns: RegExp[] = [
    /!\[[^\[\]]+\]\([^\)\s]+\)/, // image: ![alt](url)
    /\[[^\[\]]+\]\([^\)\s]+\)/, // link: [text](url)
    /\*\*[^\s*][^*]*\*\*/, // bold: **text**
    /(^|[^*])\*[^\s*][^*]*\*([^*]|$)/, // italic: *text* (not part of **)
    /~~[^\s~][^~]*~~/, // strikethrough: ~~text~~
];

/**
 * Detect whether the given plain text contains any markdown markup.
 * Recognizes block-level patterns (headings, blockquotes, lists, horizontal rules, tables)
 * and inline patterns (bold, italic, strikethrough, links, images).
 * @param text The plain text to check.
 * @returns True if the text contains any markdown markup, false otherwise.
 */
export function isContentMarkdown(text: string): boolean {
    if (!text || !text.trim()) {
        return false;
    }

    const lines = text.split(/\r\n|\r|\n/);

    for (const line of lines) {
        for (const pattern of BlockPatterns) {
            if (pattern.test(line)) {
                return true;
            }
        }
    }

    for (const pattern of InlinePatterns) {
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
}
