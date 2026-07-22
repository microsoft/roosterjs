import type { ContentModelEntity } from 'roosterjs-content-model-types';

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
     * When true, recognize math expressions embedded in the markdown text and convert them
     * into read-only "Math" entities that carry the raw LaTeX in a `data-latex` attribute.
     * The entity is created "dehydrated" (only the LaTeX source is stored, the math is not
     * rendered). Supported delimiters:
     * - Block math on their own lines: `[` ... `]`, `\[` ... `\]`, `$$` ... `$$`
     * - Single-line block math: `$$...$$`, `\[...\]`
     * - Inline math: `$...$`, `$$...$$`, `\(...\)`, `\[...\]`
     * @default false
     */
    math?: boolean;

    /**
     * The Document used to create entity wrapper elements when the `math` option is enabled.
     * When omitted, a detached document is created on demand. Callers running inside an editor
     * should pass the editor's own document (e.g. `editor.getDocument()`).
     */
    document?: Document;

    /**
     * Optional array that will be populated with every entity created during the conversion
     * (e.g. math entities). This lets the caller discover which entities are new.
     */
    entities?: ContentModelEntity[];
}
