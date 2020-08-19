import normalizeContentColor from './normalizeContentColor';
import { Browser, createWrapper } from 'roosterjs-editor-dom';
import {
    DarkModePluginState,
    EditorOptions,
    IEditor,
    PluginWithState,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Copy plugin, hijacks copy events to normalize the content to the clipboard.
 */
export default class DarkModePlugin implements PluginWithState<DarkModePluginState> {
    private editor: IEditor;
    private eventDisposer: () => void;
    private state: Wrapper<DarkModePluginState>;

    /**
     * Construct a new instance of DarkModePlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = createWrapper({
            isDarkMode: options.inDarkMode,
            onExternalContentTransform: options.onExternalContentTransform,
        });
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Copy';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.eventDisposer =
            !Browser.isIE &&
            editor.addDomEventHandler({
                copy: this.onExtract(false),
                cut: this.onExtract(true),
            });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.eventDisposer) {
            this.eventDisposer();
            this.eventDisposer = null;
        }
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onExtract = (isCut: boolean) => (event: Event) => {
        // if it's dark mode...
        if (this.editor && this.state.value.isDarkMode) {
            // get whatever the current selection range is
            const selectionRange = this.editor.getSelectionRange();
            if (selectionRange && !selectionRange.collapsed) {
                const clipboardEvent = event as ClipboardEvent;
                const copyFragment = selectionRange.cloneContents();

                const containerDiv = this.editor.getDocument().createElement('div');

                // Leverage script execution policy on CEDs to try and prevent XSS
                containerDiv.contentEditable = 'true';
                containerDiv.appendChild(copyFragment);

                // revert just this selected range to light mode colors
                normalizeContentColor(containerDiv);

                // put it on the clipboard
                clipboardEvent.clipboardData.setData('text/html', containerDiv.innerHTML);
                clipboardEvent.clipboardData.setData('text/plain', containerDiv.innerText);

                // if it's cut, delete the contents
                if (isCut) {
                    selectionRange.deleteContents();
                }

                event.preventDefault();
            }
        }
    };
}
