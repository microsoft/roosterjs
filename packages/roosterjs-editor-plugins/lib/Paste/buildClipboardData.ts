import { ClipboardData, ContentPosition, DefaultFormat } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { fromHtml, Browser } from 'roosterjs-editor-dom';
import { getFormatState } from 'roosterjs-editor-api';

const CONTAINER_HTML =
    '<div contenteditable style="width: 1px; height: 1px; overflow: hidden; position: fixed; top: 0; left; 0; -webkit-user-select: text"></div>';

// HTML header to indicate where is the HTML content started from.
// Sample header:
// Version:0.9
// StartHTML:71
// EndHTML:170
// StartFragment:140
// EndFragment:160
// StartSelection:140
// EndSelection:160
const CLIPBOARD_HTML_HEADER_REGEX = /^Version:[0-9\.]+\s+StartHTML:\s*([0-9]+)\s+EndHTML:\s*([0-9]+)\s+/i;

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

/**
 * Build ClipboardData from a paste event
 * @param event The paste event
 * @param editor The editor
 * @param callback Callback function when data is ready
 */
export default function buildClipboardData(
    event: ClipboardEvent,
    editor: Editor,
    callback: (clipboardData: ClipboardData) => void
) {
    let dataTransfer =
        event.clipboardData || (<WindowForIE>editor.getDocument().defaultView).clipboardData;
    let types: string[] = dataTransfer.types ? [].slice.call(dataTransfer.types) : [];
    let text = dataTransfer.getData('text');
    let retrieveHtmlCallback = (html: string) => {
        if (Browser.isEdge) {
            html = workaroundForEdge(html);
        }
        callback({
            snapshotBeforePaste: null,
            originalFormat: getCurrentFormat(editor),
            types,
            image: getImage(dataTransfer),
            text,
            html,
            rawHtml: html,
        });
    };

    if (event.clipboardData && event.clipboardData.items) {
        directRetrieveHtml(event, retrieveHtmlCallback);
    } else {
        retrieveHtmlViaTempDiv(editor, retrieveHtmlCallback);
    }
}

function getCurrentFormat(editor: Editor): DefaultFormat {
    let format = getFormatState(editor);
    return format
        ? {
              fontFamily: format.fontName,
              fontSize: format.fontSize,
              textColor: format.textColor,
              backgroundColor: format.backgroundColor,
              bold: format.isBold,
              italic: format.isItalic,
              underline: format.isUnderline,
          }
        : {};
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

function directRetrieveHtml(event: ClipboardEvent, callback: (html: string) => void) {
    event.preventDefault();
    let items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.type && item.type.indexOf('text/html') == 0) {
            item.getAsString(callback);
            return;
        }
    }
    callback(null);
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

/**
 * Edge sometimes doesn't remove the headers, which cause we paste more things then expected.
 * So we need to remove it in our code
 * @param html The HTML string got from clipboard
 */
function workaroundForEdge(html: string) {
    let headerValues = CLIPBOARD_HTML_HEADER_REGEX.exec(html);

    if (headerValues && headerValues.length == 3) {
        let start = parseInt(headerValues[1]);
        let end = parseInt(headerValues[2]);
        if (start > 0 && end > start) {
            html = html.substring(start, end);
        }
    }

    return html;
}
