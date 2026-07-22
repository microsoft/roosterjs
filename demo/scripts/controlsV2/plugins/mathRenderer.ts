import type { MathRenderer } from 'roosterjs-content-model-plugins';

/**
 * KaTeX is loaded from CDN in demo/index.html and exposed as a global.
 * See https://katex.org/ for the open source library used to render math.
 */
declare const katex:
    | {
          render: (
              expression: string,
              baseNode: HTMLElement,
              options?: { displayMode?: boolean; throwOnError?: boolean; output?: string }
          ) => void;
      }
    | undefined;

/**
 * Which representation KaTeX should output. By default KaTeX emits BOTH a `.katex-html`
 * (visual) and a `.katex-mathml` (accessibility) copy. To avoid keeping two copies we ask
 * KaTeX to emit only one:
 * - 'html': keep only the visual `.katex-html` copy (default)
 * - 'mathml': keep only the `.katex-mathml` copy
 */
export type KatexOutput = 'html' | 'mathml';

/**
 * Create a MathRenderer for the demo that renders LaTeX using KaTeX, keeping only a single
 * representation. If KaTeX failed to load, it falls back to showing the raw LaTeX text.
 * @param output Which single representation to keep. Default is 'html'.
 */
export function createKatexMathRenderer(output: KatexOutput = 'html'): MathRenderer {
    return (latex, isBlock, doc) => {
        const container = doc.createElement(isBlock ? 'div' : 'span');

        if (typeof katex != 'undefined' && katex) {
            try {
                katex.render(latex, container, {
                    displayMode: isBlock,
                    throwOnError: false,
                    output,
                });
            } catch {
                container.textContent = latex;
            }
        } else {
            container.textContent = latex;
        }

        return container;
    };
}

/**
 * A MathRenderer implementation for the demo that renders LaTeX using KaTeX, keeping only the
 * visual `.katex-html` copy. If KaTeX failed to load, it falls back to showing the raw LaTeX text.
 */
export const katexMathRenderer: MathRenderer = createKatexMathRenderer('mathml');
