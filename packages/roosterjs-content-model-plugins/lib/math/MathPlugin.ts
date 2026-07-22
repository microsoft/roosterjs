import { insertEntity } from 'roosterjs-content-model-api';
import type { MathOptions, MathRenderer } from './MathOptions';
import type {
    ContentModelEntity,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

/**
 * Entity type used for math entities inserted by MathPlugin
 */
export const MathEntityType: string = 'Math';

/**
 * Attribute on the entity wrapper that stores the original LaTeX source.
 * It is persisted together with the entity HTML so the math can be re-rendered
 * when content is loaded back into the editor.
 */
const DataLatex = 'data-latex';

/**
 * A plugin to support read-only math (LaTeX) entities in RoosterJS.
 *
 * Math is stored in the Content Model as a read-only entity whose wrapper element
 * holds the original LaTeX source in a `data-latex` attribute. The plugin renders the
 * LaTeX into displayable HTML using a pluggable renderer (e.g. KaTeX) whenever a new
 * math entity appears - on insert, on paste, or when saved content is loaded.
 *
 * @example
 * ```ts
 * // `katex` here is the KaTeX library loaded in your app
 * const mathPlugin = new MathPlugin({
 *     renderer: (latex, isBlock, doc) => {
 *         const span = doc.createElement('span');
 *         katex.render(latex, span, { displayMode: isBlock, throwOnError: false });
 *         return span;
 *     },
 * });
 *
 * // pass mathPlugin into the editor's plugin list, then:
 * mathPlugin.insertMath('c = \\pm\\sqrt{a^2 + b^2}', false);
 * ```
 */
export class MathPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private renderer: MathRenderer;

    /**
     * Create an instance of MathPlugin
     * @param options Options for this plugin. See MathOptions
     */
    constructor(options?: MathOptions) {
        this.renderer = options?.renderer ?? defaultRenderer;
    }

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'Math';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == 'entityOperation' &&
            event.operation == 'newEntity' &&
            event.entity.type == MathEntityType
        ) {
            // A math entity has appeared (paste, setContent or insert). Render it from its
            // LaTeX source so the displayed HTML is always consistent with the source.
            this.renderMath(event.entity.wrapper);
        }
    }

    /**
     * Insert a math entity into the editor at the current selection
     * @param latex The LaTeX source string of the math to insert
     * @param isBlock True to insert a block (display) math, false to insert inline math
     * @returns The inserted math entity, or null if it could not be inserted
     */
    insertMath(latex: string, isBlock: boolean): ContentModelEntity | null {
        const editor = this.editor;

        if (!editor) {
            return null;
        }

        const entity = insertEntity(editor, MathEntityType, isBlock, 'focus');

        if (entity) {
            entity.wrapper.setAttribute(DataLatex, latex);
            this.renderMath(entity.wrapper);
        }

        return entity;
    }

    private renderMath(wrapper: HTMLElement) {
        const latex = wrapper.getAttribute(DataLatex);

        if (latex == null) {
            return;
        }

        const doc = wrapper.ownerDocument;
        const isBlock = wrapper.tagName == 'DIV';
        const rendered = this.renderer(normalizeLatex(latex), isBlock, doc);

        wrapper.textContent = '';
        wrapper.appendChild(rendered);
    }
}

/**
 * Normalize a LaTeX string before rendering. Markdown pasted from some sources (e.g. ChatGPT)
 * can contain a run of "=" characters that was originally a setext heading underline (for
 * example "==============="). Collapse any run of two or more "=" into a single "=" so it does
 * not corrupt the rendered math.
 * @param latex The raw LaTeX source
 */
function normalizeLatex(latex: string): string {
    return latex.replace(/={2,}/g, '=');
}

function defaultRenderer(latex: string, _isBlock: boolean, doc: Document): Node {
    return doc.createTextNode(latex);
}
