import { Browser } from './Browser';
import { ClipboardItems } from 'roosterjs-editor-types';

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
 * Extract a Clipboard event
 * @param event The paste event
 * @param callback Callback function when data is ready
 * @param fallbackHtmlRetriever If direct HTML retriving is not support (e.g. Internet Explorer), as a fallback,
 * using this helper function to retrieve HTML content
 * @returns An object with the following properties:
 *  types: Available types from the clipboard event
 *  text: Plain text from the clipboard event
 *  image: Image file from the clipboard event
 *  html: Html string from the clipboard event. When set to null, it means there's no HTML found from the event.
 *   When set to undefined, it means can't retrieve HTML string, there may be HTML string but direct retrieving is
 *   not supported by browser.
 */
export default function extractClipboardEvent(
    event: ClipboardEvent,
    callback: (items: ClipboardItems) => void
) {
    let dataTransfer =
        event.clipboardData ||
        (<WindowForIE>(<Node>event.target).ownerDocument.defaultView).clipboardData;
    let result: ClipboardItems = {
        types: dataTransfer.types ? [].slice.call(dataTransfer.types) : [],
        text: dataTransfer.getData('text'),
        image: getImage(dataTransfer),
        html: undefined,
    };

    if (event.clipboardData && event.clipboardData.items) {
        event.preventDefault();
        let items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.type && item.type.indexOf('text/html') == 0) {
                item.getAsString(html => {
                    result.html = Browser.isEdge ? workaroundForEdge(html) : html;
                    callback(result);
                });
                return;
            }
        }

        // No HTML content found, set html to null
        result.html = null;
    }

    callback(result);
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
