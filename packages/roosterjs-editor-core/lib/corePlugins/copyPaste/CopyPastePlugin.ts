import { ClipboardData, ContentPosition, EditorPlugin, IEditor } from 'roosterjs-editor-types';
import { extractClipboardEvent, fromHtml, readFile } from 'roosterjs-editor-dom';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

/**
 * @internal
 * Copy and paste plugin for handling onCopy and onPaste event
 */
export default class CopyPastePlugin implements EditorPlugin {
    private editor: IEditor;
    private disposer: () => void;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'CopyPaste';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler('paste', this.onPaste);
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    private onPaste = (event: Event) => {
        extractClipboardEvent(event as ClipboardEvent, items => {
            if (items.rawHtml === undefined) {
                // Can't get pasted HTML directly, need to use a temp DIV to retrieve pasted content.
                // This is mostly for IE
                const originalSelectionRange = this.editor.getSelectionRange();
                const tempDiv = this.editor.getCustomData(
                    'PasteDiv',
                    this.createTempDivForIE,
                    pasteDiv => pasteDiv.parentNode.removeChild(pasteDiv)
                );
                tempDiv.style.display = '';
                tempDiv.focus();

                this.editor.runAsync(() => {
                    // restore original selection range in editor
                    this.editor.select(originalSelectionRange);
                    items.rawHtml = tempDiv.innerHTML;
                    tempDiv.style.display = 'none';
                    tempDiv.innerHTML = '';
                    this.paste(items);
                });
            } else {
                this.paste(items);
            }
        });
    };

    private paste(clipboardData: ClipboardData) {
        if (clipboardData.image) {
            readFile(clipboardData.image, dataUrl => {
                clipboardData.imageDataUri = dataUrl;
                this.editor.paste(clipboardData);
            });
        } else {
            this.editor.paste(clipboardData);
        }
    }

    private createTempDivForIE = () => {
        const pasteDiv = fromHtml(CONTAINER_HTML, this.editor.getDocument())[0] as HTMLElement;
        this.editor.insertNode(pasteDiv, {
            position: ContentPosition.Outside,
        });
        return pasteDiv;
    };
}
