import { Editor, EditorPlugin } from 'roosterjs-editor-core';

/**
 * Copy plugin, hijacks copy events to normalize the content to the clipboard.
 */
export default class CopyPlugin implements EditorPlugin {
    private editor: Editor;
    private copyDisposer: () => void;

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
        this.copyDisposer = editor.addDomEventHandler('copy', this.onCopy);
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.copyDisposer();
        this.copyDisposer = null;
        this.editor = null;
    }

    private onCopy = (event: Event) => {
        // if it's dark mode...
        if (this.editor && this.editor.isDarkMode()) {
            // get whatever the current selection range is
            const copyFragment = this.editor.getSelection().getRangeAt(0).cloneContents();

            // revert just this selected range to light mode colors
            const normalizerDiv = document.createElement('div');
            normalizerDiv.appendChild(copyFragment);
            const normalizedFragment = this.editor.getColorNormalizedContent(normalizerDiv.innerHTML);

            // put it on the clipboard
            (event as ClipboardEvent).clipboardData.setData('text/html', normalizedFragment);
            event.preventDefault();
        }
    }
}
