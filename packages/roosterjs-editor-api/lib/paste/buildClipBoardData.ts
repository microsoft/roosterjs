import processImages from './utils/processImages';
import { ClipBoardData } from 'roosterjs-editor-types';
import { Editor } from 'roosterjs-editor-core';
import { convertInlineCss, fromHtml } from 'roosterjs-editor-dom';

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
export default function buildClipBoardData(
    event: ClipboardEvent,
    editor: Editor,
    callback: (clipboardData: ClipBoardData) => void,
    unsafeHtmlFilter?: (html: string) => string,
) {
    let dataTransfer =
        event.clipboardData || (<WindowForIE>editor.getDocument().defaultView).clipboardData;
    let clipboardData: ClipBoardData = {
        imageData: {
            file: getImage(dataTransfer),
        },
        textData: dataTransfer.getData('text'),
        htmlData: null,
        htmlFragment: null,
    };
    let retrieveHtmlCallback = createCallback(editor, clipboardData, unsafeHtmlFilter, callback);

    if (!unsafeHtmlFilter || !directRetrieveHtml(event, editor, retrieveHtmlCallback)) {
        retrieveHtmlViaTempDiv(editor, retrieveHtmlCallback);
    }
}

function createCallback(
    editor: Editor,
    clipboardData: ClipBoardData,
    unsafeHtmlFilter: (html: string) => string,
    pasteCallback: (data: ClipBoardData) => void) {
    return (html: string) => {
        if (unsafeHtmlFilter) {
            html = unsafeHtmlFilter(html);
        }
        html = convertInlineCss(html);
        html = normalizeContent(html);

        // 4. Prepare HTML fragment for pasting
        let document = editor.getDocument();
        let fragment = document.createDocumentFragment();
        let nodes = fromHtml(html, document);
        for (let node of nodes) {
            fragment.appendChild(node);
        }

        clipboardData.htmlData = html;
        clipboardData.htmlFragment = fragment;

        processImages(clipboardData);
        pasteCallback(clipboardData);
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
    callback: (html: string) => void
) {
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
    // 1. Remove content outside HTML tag if any
    let matches = HTML_REGEX.exec(content);
    content = matches ? matches[0] : content;

    // Remove 'position' style from source HTML
    content = content.replace(INLINE_POSITION_STYLE, '$1');
    content = content.replace(COMMENT, '');

    // Replace <BR> with <DIV>
    if (TEXT_WITH_BR_ONLY.test(content)) {
        content = '<div>' + content.replace(/<br>/gi, '</div><div>') + '<br></div>';
    }

    return content;
}
