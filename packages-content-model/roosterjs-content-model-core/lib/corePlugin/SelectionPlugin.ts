import type { IEditor, PluginWithState } from 'roosterjs-editor-types';
import type {
    IStandaloneEditor,
    SelectionPluginState,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

class SelectionPlugin implements PluginWithState<SelectionPluginState> {
    private editor: (IStandaloneEditor & IEditor) | null = null;
    private state: SelectionPluginState;
    private disposer: (() => void) | null = null;

    constructor(options: StandaloneEditorOptions) {
        this.state = {
            selectionRange: null,
            tableSelectionRange: null,
            imageSelectionRange: null,
            selectionStyleNode: null,
            imageSelectionBorderColor: options.imageSelectionBorderColor, // TODO: Move to Selection core plugin
        };
    }

    getName() {
        return 'Selection';
    }

    initialize(editor: IEditor) {
        this.editor = editor as IEditor & IStandaloneEditor;

        const doc = this.editor.getDocument();
        const styleNode = doc.createElement('style');

        doc.head.appendChild(styleNode);
        this.state.selectionStyleNode = styleNode;

        const env = this.editor.getEnvironment();
        const document = this.editor.getDocument();

        if (env.isSafari) {
            document.addEventListener('mousedown', this.onMouseDownDocument, true /*useCapture*/);
            document.addEventListener('keydown', this.onKeyDownDocument);
            document.defaultView?.addEventListener('blur', this.onBlur);
            this.disposer = this.editor.addDomEventHandler('focus', this.onFocus);
        } else {
            this.disposer = this.editor.addDomEventHandler({
                focus: this.onFocus,
                blur: this.onBlur,
            });
        }
    }

    dispose() {
        if (this.state.selectionStyleNode) {
            this.state.selectionStyleNode.parentNode?.removeChild(this.state.selectionStyleNode);
            this.state.selectionStyleNode = null;
        }

        if (this.disposer) {
            this.disposer();
            this.disposer = null;
        }

        if (this.editor) {
            const document = this.editor.getDocument();

            document.removeEventListener(
                'mousedown',
                this.onMouseDownDocument,
                true /*useCapture*/
            );
            document.removeEventListener('keydown', this.onKeyDownDocument);
            document.defaultView?.removeEventListener('blur', this.onBlur);

            this.editor = null;
        }
    }

    getState(): SelectionPluginState {
        return this.state;
    }

    private onFocus = () => {
        if (!this.state.skipReselectOnFocus && this.editor) {
            const { table, coordinates } = this.state.tableSelectionRange || {};
            const { image } = this.state.imageSelectionRange || {};

            if (table && coordinates) {
                this.editor.select(table, coordinates);
            } else if (image) {
                this.editor.select(image);
            } else if (this.state.selectionRange) {
                this.editor.select(this.state.selectionRange);
            }
        }

        this.state.selectionRange = null;
    };

    private onBlur = () => {
        if (!this.state.selectionRange && this.editor) {
            this.state.selectionRange = this.editor.getSelectionRange(false /*tryGetFromCache*/);
        }
    };

    private onKeyDownDocument = (event: KeyboardEvent) => {
        if (event.key == 'Tab' && !event.defaultPrevented) {
            this.onBlur();
        }
    };

    private onMouseDownDocument = (event: MouseEvent) => {
        if (this.editor && !this.editor.contains(event.target as Node)) {
            this.onBlur();
        }
    };
}

/**
 * @internal
 * Create a new instance of SelectionPlugin.
 * @param option The editor option
 */
export function createSelectionPlugin(
    options: StandaloneEditorOptions
): PluginWithState<SelectionPluginState> {
    return new SelectionPlugin(options);
}
