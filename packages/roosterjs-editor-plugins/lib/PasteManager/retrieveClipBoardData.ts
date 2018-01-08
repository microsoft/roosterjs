import ClipBoardData from './ClipboardData';
import { ContentPosition } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml } from 'roosterjs-editor-dom';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

export interface PasteHelper {
    tempDiv?: HTMLElement;
}

export default function retrieveClipBoardData(
    event: ClipboardEvent,
    editor: Editor,
    helper: PasteHelper,
    useDirectPaste: boolean,
    callback: (clipboardData: ClipBoardData) => void
) {
    let dataTransfer =
        event.clipboardData || (<WindowForIE>editor.getDocument().defaultView).clipboardData;
    let clipboardData: ClipBoardData = {
        imageData: {
            file: getImage(dataTransfer),
        },
        textData: dataTransfer.getData('text'),
        htmlData: null,
    };

    let retrieveHtmlCallback = (html: string) => {
        clipboardData.htmlData = html;
        callback(clipboardData);
    };

    if (!useDirectPaste || !directRetrieveHtml(event, editor, retrieveHtmlCallback)) {
        retrieveHtmlViaTempDiv(editor, helper, retrieveHtmlCallback);
    }
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

function directRetrieveHtml(
    event: ClipboardEvent,
    editor: Editor,
    callback: (html: string) => void
): boolean {
    let clipboardData = event.clipboardData;
    let fileCount = clipboardData && clipboardData.items ? clipboardData.items.length : 0;
    for (let i = 0; i < fileCount; i++) {
        let item = clipboardData.items[i];
        if (item.type && item.type.indexOf('text/html') == 0) {
            event.preventDefault();
            item.getAsString(callback);
            return true;
        }
    }

    return false;
}

function retrieveHtmlViaTempDiv(
    editor: Editor,
    helper: PasteHelper,
    callback: (html: string) => void
) {
    // cache original selection range in editor
    let originalSelectionRange = editor.getSelectionRange();

    if (!helper.tempDiv || !helper.tempDiv.parentNode) {
        helper.tempDiv = fromHtml(
            CONTAINER_HTML,
            editor.getDocument()
        )[0] as HTMLElement;
        editor.insertNode(helper.tempDiv, {
            position: ContentPosition.Outside,
            updateCursor: false,
            replaceSelection: false,
            insertOnNewLine: false,
        });
    } else {
        helper.tempDiv.style.display = '';
    }
    helper.tempDiv.focus();

    window.requestAnimationFrame(() => {
        if (editor) {
            // restore original selection range in editor
            editor.updateSelection(originalSelectionRange);
            callback(helper.tempDiv.innerHTML);
            helper.tempDiv.style.display = 'none';
            helper.tempDiv.innerHTML = '';
        }
    });
}
