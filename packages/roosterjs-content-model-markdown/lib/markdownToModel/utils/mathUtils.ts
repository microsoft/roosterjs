/**
 * @internal
 * Information about a line that opens a block math region.
 */
export interface BlockMathOpen {
    /**
     * When set, the whole math expression is contained on this single line, and this is its
     * LaTeX content. When undefined, this line only opens a multi-line block that will be
     * closed later by `closeDelimiter`.
     */
    singleLineLatex?: string;

    /**
     * The delimiter (trimmed) that closes this multi-line math block.
     * Only set when `singleLineLatex` is undefined.
     */
    closeDelimiter?: string;
}

/**
 * @internal
 * Inline math match result.
 */
export interface InlineMathMatch {
    /**
     * The LaTeX content of the matched inline math.
     */
    latex: string;

    /**
     * Number of characters consumed from the start of the input.
     */
    length: number;
}

/**
 * @internal
 * Detect whether a whole line opens (or fully contains) a block math region.
 * @param line The markdown line
 * @returns Info about the opened block math, or null when the line is not a block math opener
 */
export function parseBlockMathOpen(line: string): BlockMathOpen | null {
    const trimmed = line.trim();

    // Single-line block math: $$...$$
    if (trimmed.length >= 4 && trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
        return { singleLineLatex: trimmed.slice(2, -2).trim() };
    }

    // Single-line block math: \[...\]
    if (trimmed.length >= 4 && trimmed.startsWith('\\[') && trimmed.endsWith('\\]')) {
        return { singleLineLatex: trimmed.slice(2, -2).trim() };
    }

    // Multi-line openers
    if (trimmed == '$$') {
        return { closeDelimiter: '$$' };
    }

    if (trimmed == '\\[') {
        return { closeDelimiter: '\\]' };
    }

    if (trimmed == '[') {
        return { closeDelimiter: ']' };
    }

    return null;
}

/**
 * @internal
 * Check if a line closes an open multi-line math block.
 * @param line The markdown line
 * @param closeDelimiter The delimiter that closes the current math block
 */
export function isBlockMathClose(line: string, closeDelimiter: string): boolean {
    return line.trim() == closeDelimiter;
}

const inlineMathPatterns: RegExp[] = [
    /^\$\$([\s\S]+?)\$\$/, // $$...$$
    /^\\\[([\s\S]+?)\\\]/, // \[...\]
    /^\\\(([\s\S]+?)\\\)/, // \(...\)
    /^\$([^\s$](?:[^$\n]*[^\s$])?)\$/, // $...$ (no surrounding whitespace, avoids currency false positives)
];

/**
 * @internal
 * Try to match an inline math expression anchored at the start of the input.
 * @param text The remaining inline text to scan
 * @returns The matched inline math, or null when the input does not start with inline math
 */
export function matchInlineMath(text: string): InlineMathMatch | null {
    for (const pattern of inlineMathPatterns) {
        const match = pattern.exec(text);

        if (match) {
            return { latex: match[1].trim(), length: match[0].length };
        }
    }

    return null;
}
