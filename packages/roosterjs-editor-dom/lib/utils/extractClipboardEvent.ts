import toArray from './toArray';
import { Browser } from './Browser';
import {
    ClipboardData,
    EdgeLinkPreview,
    ExtractClipboardEventOption,
} from 'roosterjs-editor-types';

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
const TEXT_TYPE_PREFIX = 'text/';
const IMAGE_TYPE_PREFIX = 'image/';
const HTML_TYPE = TEXT_TYPE_PREFIX + 'html';
const LINKPREVIEW_TYPE = TEXT_TYPE_PREFIX + 'link-preview';

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
    callback: (items: ClipboardData) => void,
    options?: ExtractClipboardEventOption
) {
    let dataTransfer =
        event.clipboardData ||
        (<WindowForIE>(<Node>event.target).ownerDocument.defaultView).clipboardData;
    let result: ClipboardData = {
        types: dataTransfer.types ? toArray(dataTransfer.types) : [],
        text: dataTransfer.getData('text'),
        image: getImage(dataTransfer),
        rawHtml: undefined,
        customValues: {},
    };

    const handlers: {
        promise: Promise<string>;
        callback: (value: string) => void;
    }[] = [];

    if (event.clipboardData && event.clipboardData.items) {
        event.preventDefault();

        // Set rawHtml to null so that caller knows that we have tried
        result.rawHtml = null;
        const items = event.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            switch (item.type) {
                case HTML_TYPE:
                    handlers.push({
                        promise: getAsString(item),
                        callback: value => {
                            result.rawHtml = Browser.isEdge ? workaroundForEdge(value) : value;
                        },
                    });
                    break;
                case LINKPREVIEW_TYPE:
                    if (options?.allowLinkPreview) {
                        handlers.push({
                            promise: getAsString(item),
                            callback: value => {
                                try {
                                    result.linkPreview = JSON.parse(value) as EdgeLinkPreview;
                                } catch {}
                            },
                        });
                    }
                    break;
                default:
                    if (item.type.indexOf(TEXT_TYPE_PREFIX) == 0) {
                        const textType = item.type.substr(TEXT_TYPE_PREFIX.length);
                        if (options?.allowedCustomPasteType?.indexOf(textType) >= 0) {
                            handlers.push({
                                promise: getAsString(item),
                                callback: value => (result.customValues[textType] = value),
                            });
                        }
                    }
                    break;
            }
        }
    }

    Promise.all(handlers.map(handler => handler.promise)).then(values => {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].callback(values[i]);
        }

        callback(result);
    });
}

function getImage(dataTransfer: DataTransfer): File {
    // Chrome, Firefox, Edge support dataTransfer.items
    let fileCount = dataTransfer.items ? dataTransfer.items.length : 0;
    for (let i = 0; i < fileCount; i++) {
        let item = dataTransfer.items[i];
        if (item.type && item.type.indexOf(IMAGE_TYPE_PREFIX) == 0) {
            return item.getAsFile();
        }
    }
    // IE, Safari support dataTransfer.files
    fileCount = dataTransfer.files ? dataTransfer.files.length : 0;
    for (let i = 0; i < fileCount; i++) {
        let file = dataTransfer.files.item(i);
        if (file.type && file.type.indexOf(IMAGE_TYPE_PREFIX) == 0) {
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

function getAsString(item: DataTransferItem): Promise<string> {
    return new Promise<string>(resolve => {
        item.getAsString(value => {
            resolve(value);
        });
    });
}
