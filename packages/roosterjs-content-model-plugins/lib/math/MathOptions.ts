/**
 * A function that renders a LaTeX string into a DOM node.
 * This is used by MathPlugin to convert the LaTeX source of a math entity into
 * displayable HTML when the entity is inserted, pasted or loaded from saved content.
 *
 * A typical implementation uses an open source math rendering library such as KaTeX.
 * With KaTeX loaded (for example as the `katex` module), a renderer looks like:
 *
 * ```ts
 * const renderer: MathRenderer = (latex, isBlock, doc) => {
 *     const span = doc.createElement('span');
 *     katex.render(latex, span, { displayMode: isBlock, throwOnError: false });
 *     return span;
 * };
 * ```
 *
 * @param latex The LaTeX source string to render
 * @param isBlock Whether this is a block (display) math or an inline math
 * @param doc The document to create DOM nodes from
 * @returns A DOM node containing the rendered math
 */
export type MathRenderer = (latex: string, isBlock: boolean, doc: Document) => Node;

/**
 * Options for MathPlugin
 */
export interface MathOptions {
    /**
     * A renderer function to convert LaTeX source into displayable DOM.
     * When not provided, the raw LaTeX string is shown as plain text as a fallback.
     */
    renderer?: MathRenderer;
}
