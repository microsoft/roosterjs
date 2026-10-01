/** A literal fenced block, before inline Markdown processing. */
export interface FencedCodeBlock {
    /** Exact body, with physical line endings normalized to LF. */
    source: string;
    /** Unparsed, trimmed opening-fence info string. */
    info: string;
    /** Opening delimiter, including its original length. */
    fence: string;
    /** Whether a closing delimiter was present. */
    closed: boolean;
}
