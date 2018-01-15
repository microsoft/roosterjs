import { ClipboardData, DefaultFormat } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { convertInlineCss } from 'roosterjs-editor-dom';
import { getFormatState } from 'roosterjs-editor-api';

const INLINE_POSITION_STYLE = /(<\w+[^>]*style=['"][^>]*)position:[^>;'"]*/gi;
const TEXT_WITH_BR_ONLY = /^[^<]*(<br>[^<]*)+$/i;
const COMMENT = /<!--([\s\S]*?)-->/gi;
const HTML_REGEX = /<html[^>]*>[\s\S]*<\/html>/i;

interface WindowForIE extends Window {
    clipboardData: DataTransfer;
}

/**
 * Build ClipboardData from a paste event
 * @param event The paste event
 * @param editor The editor
 * @param callback Callback function when data is ready
 * @param useDirectPaste Whether use direct HTML instead of using temp DIV
 */
export default function buildClipboardData(
    event: ClipboardEvent,
    editor: Editor,
    unsafeHtmlFilter?: (html: string) => string
): Promise<ClipboardData> {
    return new Promise<ClipboardData>((resolve, reject) => {
        let dataTransfer =
            event.clipboardData || (<WindowForIE>editor.getDocument().defaultView).clipboardData;
        let clipboardData: ClipboardData = {
            snapshotBeforePaste: null,
            originalFormat: getCurrentFormat(editor),
            image: getImage(dataTransfer),
            text: dataTransfer.getData('text'),
            html: null,
        };

        let retrieveHtmlCallback = (html: string) => {
            let matches = HTML_REGEX.exec(html);
            html = matches ? matches[0] : html;
            html = unsafeHtmlFilter ? unsafeHtmlFilter(html) : html;
            html = convertInlineCss(html);
            html = normalizeContent(html);
            clipboardData.html = html;
            resolve(clipboardData);
        };

        if (!unsafeHtmlFilter || !directRetrieveHtml(event, retrieveHtmlCallback)) {
            retrieveHtmlViaTempDiv(editor, retrieveHtmlCallback);
        }
    });
}

function getCurrentFormat(editor: Editor): DefaultFormat {
    let format = getFormatState(editor);
    return {
        fontFamily: format.fontName,
        fontSize: format.fontSize,
        textColor: format.textColor,
        backgroundColor: format.backgroundColor,
        bold: format.isBold,
        italic: format.isItalic,
        underline: format.isUnderline,
    };
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

function directRetrieveHtml(event: ClipboardEvent, callback: (html: string) => void): boolean {
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

function retrieveHtmlViaTempDiv(editor: Editor, callback: (html: string) => void) {
    // cache original selection range in editor
    let originalSelectionRange = editor.getSelectionRange();
    let tempDiv = editor.getTempDivForPaste();
    tempDiv.focus();

    window.requestAnimationFrame(() => {
        if (editor) {
            // restore original selection range in editor
            editor.updateSelection(originalSelectionRange);
            callback(tempDiv.innerHTML);
            tempDiv.style.display = 'none';
            tempDiv.innerHTML = '';
        }
    });
}

function normalizeContent(content: string): string {
    // Remove 'position' style from source HTML
    content = content.replace(INLINE_POSITION_STYLE, '$1');
    content = content.replace(COMMENT, '');

    // Replace <BR> with <DIV>
    if (TEXT_WITH_BR_ONLY.test(content)) {
        content = '<div>' + content.replace(/<br>/gi, '</div><div>') + '<br></div>';
    }

    return content;
}
