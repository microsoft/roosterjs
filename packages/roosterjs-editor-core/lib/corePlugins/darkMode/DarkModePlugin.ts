import { Browser, createWrapper, setHtmlWithSelectionPath } from 'roosterjs-editor-dom';
import {
    DarkModePluginState,
    EditorOptions,
    IEditor,
    PluginWithState,
    Wrapper,
    GetContentMode,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Dark mode plugin, handles dark mode related color transform events
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
        return 'DarkMode';
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
                const containerDiv = this.editor.getDocument().createElement('div');

                // Leverage script execution policy on CEDs to try and prevent XSS
                containerDiv.contentEditable = 'true';
                const html = this.editor.getContent(GetContentMode.RawHTMLWithSelection);
                const range = setHtmlWithSelectionPath(containerDiv, html);
                const copyFragment = range.cloneContents();

                containerDiv.innerHTML = '';
                containerDiv.appendChild(copyFragment);

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
