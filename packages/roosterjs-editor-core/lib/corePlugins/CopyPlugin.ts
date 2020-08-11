import normalizeContentColor from '../darkMode/normalizeContentColor';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';

// TODO: Rename to DarkmodePlugin in next major release
/**
 * Copy plugin, hijacks copy events to normalize the content to the clipboard.
 */
export default class CopyPlugin implements EditorPlugin {
    private editor: Editor;
    private eventDisposer: () => void;

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
    public initialize(editor: Editor) {
        this.editor = editor;
        this.eventDisposer = editor.addDomEventHandler({
            copy: this.onExtract(false),
            cut: this.onExtract(true),
        });
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.eventDisposer();
        this.eventDisposer = null;
        this.editor = null;
    }

    private onExtract = (isCut: boolean) => (event: Event) => {
        // if it's dark mode...
        if (this.editor && this.editor.isDarkMode()) {
            // get whatever the current selection range is
            const selectionRange = this.editor.getSelectionRange();
            if (selectionRange && !selectionRange.collapsed) {
                const clipboardEvent = event as ClipboardEvent;
                const copyFragment = this.editor.getSelectionRange().cloneContents();

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
                    this.editor.getSelectionRange().deleteContents();
                }

                event.preventDefault();
            }
        }
    };
}
