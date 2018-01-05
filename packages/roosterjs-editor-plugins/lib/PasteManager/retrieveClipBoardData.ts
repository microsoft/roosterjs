import ClipBoardData from './ClipboardData';
import { ContentPosition } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml } from 'roosterjs-editor-dom';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

function getClipboardDataFromEvent(event: ClipboardEvent, editor: Editor): DataTransfer {
    return event.clipboardData || (<WindowForIE>editor.getDocument().defaultView).clipboardData;
}

export default function retrieveClipBoardData(
    event: ClipboardEvent,
    editor: Editor,
    callback: (clipboardData: ClipBoardData) => void,
    pasteContainer: HTMLElement,
    useDirectHtml: boolean): HTMLElement {
    let dataTransfer = getClipboardDataFromEvent(event, editor);
    let clipboardData: ClipBoardData = {
        imageData: {
            file: getImage(dataTransfer)
        },
        textData: dataTransfer.getData('text'),
        htmlData: null,
    };

    return retrieveHtml(
        event,
        editor,
        html => {
            clipboardData.htmlData = html;
            callback(clipboardData);
        },
        pasteContainer,
        useDirectHtml);
}

function getImage(dataTransfer: DataTransfer): File {
    // Chrome, Firefox, Edge support dataTransfer.items
    let fileCount = dataTransfer.items ? dataTransfer.items.length : 0;
    for (let i = 0; i < fileCount; i++) {
        let item = dataTransfer.items[i];
        if (item.type && item.type.indexOf('image/') == 0) {
            return item.getAsFile();
        }
    }
    // IE, Safari support dataTransfer.files
    fileCount = dataTransfer.files ? dataTransfer.files.length : 0;
    for (let i = 0; i < fileCount; i++) {
        let file = dataTransfer.files.item(i);
        if (file.type && file.type.indexOf('image/') == 0) {
            return file;
        }
    }
    return null;
}

function retrieveHtml(
    event: ClipboardEvent,
    editor: Editor,
    callback: (html: string) => void,
    pasteContainer: HTMLElement,
    useDirectHtml: boolean
): HTMLElement {
    if (useDirectHtml) {
        let clipboardData = event.clipboardData;
        let fileCount = clipboardData && clipboardData.items ? clipboardData.items.length : 0;
        for (let i = 0; i < fileCount; i++) {
            let item = clipboardData.items[i];
            if (item.type && item.type.indexOf('text/html') == 0) {
                item.getAsString(callback);
                event.preventDefault();
                return;
            }
        }
    }

    // cache original selection range in editor
    let originalSelectionRange = editor.getSelectionRange();

    if (!pasteContainer || !pasteContainer.parentNode) {
        pasteContainer = fromHtml(CONTAINER_HTML, editor.getDocument())[0] as HTMLElement;
        editor.insertNode(pasteContainer, {
            position: ContentPosition.Outside,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });
    } else {
        pasteContainer.style.display = '';
    }
    pasteContainer.focus();

    window.requestAnimationFrame(() => {
        if (editor) {
            // restore original selection range in editor
            editor.updateSelection(originalSelectionRange);
            callback(pasteContainer.innerHTML);
            pasteContainer.style.display = 'none';
            pasteContainer.innerHTML = '';
        }
    });

    return pasteContainer;
}
