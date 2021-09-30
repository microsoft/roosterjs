import readFile from '../utils/readFile';
import { Browser } from '../utils/Browser';
import {
    ClipboardData,
    ContentType,
    ContentTypePrefix,
    EdgeLinkPreview,
    ExtractClipboardItemsOption,
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
const OTHER_TEXT_TYPE = ContentTypePrefix.Text + '*';
const EDGE_LINK_PREVIEW = 'link-preview';
const ContentHandlers: {
    [contentType: string]: (data: ClipboardData, value: string, type: string) => void;
} = {
    [ContentType.HTML]: (data, value) =>
        (data.rawHtml = Browser.isEdge ? workaroundForEdge(value) : value),
    [ContentType.PlainText]: (data, value) => (data.text = value),
    [OTHER_TEXT_TYPE]: (data, value, type) => (data.customValues[type] = value),
};

/**
 * Extract clipboard items to be a ClipboardData object for IE
 * @param items The clipboard items retrieve from a DataTransfer object
 * @param callback Callback function when data is ready
 * @returns An object with the following properties:
 *  types: Available types from the clipboard event
 *  text: Plain text from the clipboard event
 *  image: Image file from the clipboard event
 *  html: Html string from the clipboard event. When set to null, it means there's no HTML found from the event.
 *   When set to undefined, it means can't retrieve HTML string, there may be HTML string but direct retrieving is
 *   not supported by browser.
 */
export default function extractClipboardItems(
    items: DataTransferItem[],
    options?: ExtractClipboardItemsOption
): Promise<ClipboardData> {
    const data: ClipboardData = {
        types: [],
        text: '',
        image: null,
        rawHtml: null,
        customValues: {},
    };

    const contentHandlers = { ...ContentHandlers };

    if (options?.allowLinkPreview) {
        contentHandlers[ContentTypePrefix.Text + EDGE_LINK_PREVIEW] = tryParseLinkPreview;
    }

    return Promise.all(
        (items || []).map(item => {
            const type = item.type;

            if (type.indexOf(ContentTypePrefix.Image) == 0 && !data.image) {
                data.types.push(type);
                data.image = item.getAsFile();
                return new Promise(resolve => {
                    readFile(data.image, dataUrl => {
                        data.imageDataUri = dataUrl;
                        resolve();
                    });
                });
            } else {
                const customType = getAllowedCustomType(type, options?.allowedCustomPasteType);
                const handler =
                    contentHandlers[type] || (customType ? contentHandlers[OTHER_TEXT_TYPE] : null);
                return new Promise(resolve =>
                    handler
                        ? item.getAsString(value => {
                              data.types.push(type);
                              handler(data, value, customType);
                              resolve();
                          })
                        : resolve()
                );
            }
        })
    ).then(() => data);
}

/**
 * Edge sometimes doesn't remove the headers, which cause we paste more things then expected.
 * So we need to remove it in our code
 * @param html The HTML string got from clipboard
 */
function workaroundForEdge(html: string) {
    const headerValues = CLIPBOARD_HTML_HEADER_REGEX.exec(html);

    if (headerValues?.length == 3) {
        const start = parseInt(headerValues[1]);
        const end = parseInt(headerValues[2]);
        if (start > 0 && end > start) {
            html = html.substring(start, end);
        }
    }

    return html;
}

function tryParseLinkPreview(data: ClipboardData, value: string) {
    try {
        data.customValues[EDGE_LINK_PREVIEW] = value;
        data.linkPreview = JSON.parse(value) as EdgeLinkPreview;
    } catch {}
}

function getAllowedCustomType(type: string, allowedCustomPasteType: string[]) {
    let textType =
        type.indexOf(ContentTypePrefix.Text) == 0
            ? type.substr(ContentTypePrefix.Text.length)
            : null;
    return textType && allowedCustomPasteType?.indexOf(textType) >= 0 ? textType : null;
}
