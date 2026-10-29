import type { TableMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Options for processing markdown text.
 */
export interface MarkdownToModelOptions {
    /**
     * The pattern to split lines in the markdown text.
     */
    splitLinesPattern?: string;

    /**
     * Specify how should we process empty lines in the markdown text.
     * - 'preserve': Keep empty lines as they are.
     * - 'remove': Remove empty lines.
     * - 'merge': Merge empty lines with adjacent paragraphs.
     * @default 'merge'
     */
    emptyLine?: 'preserve' | 'remove' | 'merge';

    /**
     * Specify the direction of the converted markdown text
     * @default 'ltr'
     */
    direction?: 'ltr' | 'rtl' | undefined;

    /**
     * Specify the table styles to apply to tables converted from markdown.
     * When omitted, use plain markdown table styles with black borders and no header styling.
     * When specified, use the provided table metadata instead of the default markdown styles.
     */
    markdownTableStyle?: TableMetadataFormat;
}
