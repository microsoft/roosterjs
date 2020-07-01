import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { ClipboardData, ClipboardItems, ContentPosition } from 'roosterjs-editor-types';
import { extractClipboardEvent, fromHtml } from 'roosterjs-editor-dom';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

/**
 * Core paste plugin for handling onPaste event and extract the pasted content
 */
export default class CorePastePlugin implements EditorPlugin {
    private editor: Editor;
    private disposer: () => void;

    getName() {
        return 'CorePaste';
    }

    initialize(editor: Editor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler('paste', this.onPaste);
    }

    dispose() {
        this.disposer();
        this.disposer = null;
        this.editor = null;
    }

    private onPaste = (event: Event) => {
        extractClipboardEvent(event as ClipboardEvent, items => {
            if (items.html === undefined) {
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
                    items.html = tempDiv.innerHTML;
                    tempDiv.style.display = 'none';
                    tempDiv.innerHTML = '';
                    this.paste(items);
                });
            } else {
                this.paste(items);
            }
        });
    };

    private paste(items: ClipboardItems) {
        const clipboardData: ClipboardData = {
            types: items.types,
            image: items.image,
            text: items.text,
            rawHtml: items.html,

            // Will be set later
            snapshotBeforePaste: null,
            imageDataUri: null,

            // TODO: deprecated properties
            html: null,
            originalFormat: null,
        };

        if (clipboardData.image) {
            const reader = new FileReader();
            reader.onload = () => {
                clipboardData.imageDataUri = reader.result as string;
                this.editor.paste(clipboardData);
            };
            reader.onerror = () => {
                clipboardData.image = null;
                this.editor.paste(clipboardData);
            };
            reader.readAsDataURL(clipboardData.image);
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
