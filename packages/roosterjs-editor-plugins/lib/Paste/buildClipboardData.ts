import { ContentPosition, ClipboardItems } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml, extractClipboardEvent } from 'roosterjs-editor-dom';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

/**
 * Build ClipboardData from a paste event
 * @param event The paste event
 * @param editor The editor
 * @param callback Callback function when data is ready
 */
export default function buildClipboardData(
    event: ClipboardEvent,
    editor: Editor,
    callback: (items: ClipboardItems) => void
) {
    extractClipboardEvent(event, items => {
        if (items.html === undefined) {
            retrieveHtmlViaTempDiv(editor, html => {
                items.html = html;
                callback(items);
            });
        } else {
            callback(items);
        }
    });
}

function retrieveHtmlViaTempDiv(editor: Editor, callback: (html: string) => void) {
    // cache original selection range in editor
    let originalSelectionRange = editor.getSelectionRange();
    let tempDiv = getTempDivForPaste(editor);
    tempDiv.focus();

    editor.runAsync(() => {
        // restore original selection range in editor
        editor.select(originalSelectionRange);
        callback(tempDiv.innerHTML);
        tempDiv.style.display = 'none';
        tempDiv.innerHTML = '';
    });
}

function getTempDivForPaste(editor: Editor): HTMLElement {
    let tempDiv = editor.getCustomData(
        'PasteDiv',
        () => {
            let pasteDiv = fromHtml(CONTAINER_HTML, editor.getDocument())[0] as HTMLElement;
            editor.insertNode(pasteDiv, {
                position: ContentPosition.Outside,
                updateCursor: false,
                replaceSelection: false,
                insertOnNewLine: false,
            });
            return pasteDiv;
        },
        pasteDiv => {
            pasteDiv.parentNode.removeChild(pasteDiv);
        }
    );
    tempDiv.style.display = '';
    return tempDiv;
}
