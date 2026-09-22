/**
 * Fence metadata for a literal code block represented by a PRE format container.
 * The source lives in the container's text segments, not in this metadata.
 */
export interface ContentModelCodeBlockFormat {
    /** Unparsed info string following the opening fence. */
    readonly info: string;
    /** Preferred delimiter. Exporters may lengthen it to protect the source. */
    readonly fence: string;
}
