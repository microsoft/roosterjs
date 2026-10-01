import type { ContentModelBlock } from 'roosterjs-content-model-types';
import type { FencedCodeBlock } from './FencedCodeBlock';

/**
 * Options for processing markdown text.
 */
export interface MarkdownToModelOptions {
    /** Convert a literal fence to a custom block. Return undefined for the default PRE block. */
    onFencedCodeBlock?: (block: FencedCodeBlock) => ContentModelBlock | undefined;

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
}
