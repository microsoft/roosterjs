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
     * - true: Use plain markdown table styles with black borders and no header styling.
     * - false or omitted: Use the existing table styles with a styled header row.
     * - TableMetadataFormat: Apply the specified custom table styles.
     * @default false
     */
    markdownTableStyle?: boolean | TableMetadataFormat;
}
